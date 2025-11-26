import { TicketService } from './ticket.service'
import { AgentService } from '../agent/agent.service'
import { TeamService } from '../team/team.service'
import type { EventBus } from '@/events/eventBus'

/**
 * TicketListeners
 *
 * Responsável por reagir a eventos emitidos pelo TicketService,
 * TeamService e AgentService e acionar redistribuição automática
 * dos tickets pendentes.
 */
export class TicketListeners {
  constructor(
    private readonly events: EventBus,
    private readonly ticketService: TicketService,
    private readonly agentService: AgentService,
    private readonly teamService: TeamService,
  ) {}

  /**
   * Registra todos os listeners no EventBus
   */
  register() {
    // Ticket Events
    this.events.subscribe('ticket.created', async () =>
      this.handleQueueReprocess(),
    )
    this.events.subscribe('ticket.updated', async () =>
      this.handleQueueReprocess(),
    )
    this.events.subscribe('ticket.unassigned', async () =>
      this.handleQueueReprocess(),
    )

    // Agent Events
    this.events.subscribe('agent.created', async () =>
      this.handleQueueReprocess(),
    )
    this.events.subscribe('agent.updated', async () =>
      this.handleQueueReprocess(),
    )
    this.events.subscribe('agent.removed', async () =>
      this.handleQueueReprocess(),
    )

    // Team Events
    this.events.subscribe('team.memberAdded', async () =>
      this.handleQueueReprocess(),
    )
    this.events.subscribe('team.memberRemoved', async () =>
      this.handleQueueReprocess(),
    )

    // Team removed -> rebalance
    this.events.subscribe('team.removed', async () =>
      this.handleQueueReprocess(),
    )
  }

  /**
   * Reprocessa a fila de tickets não atribuídos e tenta redistribuir
   * automaticamente entre agentes disponíveis.
   */
  private async handleQueueReprocess() {
    const unassignedTickets = await this.ticketService.getUnassigned()
    if (!unassignedTickets.length) return

    const allAgents = await this.agentService.getAvailableAgents()
    const allTeams = await this.teamService.list()

    // Função para descobrir o time correto pelo tipo do ticket
    const resolveTeamForTicket = (subject: string) => {
      if (subject === 'Problemas com cartão') return 'Cartões'
      if (subject === 'contratação de empréstimo') return 'Empréstimos'
      return 'Outros Assuntos'
    }

    // Conta quantos tickets cada agente está atendendo
    const agentLoadMap: Record<number, number> = {}
    const allTickets = await this.ticketService.getUnassigned()

    allTickets.forEach((t) => {
      if (t.agentId) {
        agentLoadMap[t.agentId] = (agentLoadMap[t.agentId] || 0) + 1
      }
    })

    // Processa ticket a ticket
    for (const ticket of unassignedTickets) {
      const targetTeamName = resolveTeamForTicket(ticket.subject)

      const targetTeam = allTeams.find((t) => t.name === targetTeamName)
      if (!targetTeam) continue

      // Filtra agentes do time
      const teamAgents = allAgents.filter((a) =>
        targetTeam.agents.includes(a.id),
      )

      if (!teamAgents.length) {
        // Nenhum agente no time → ticket permanece na fila
        continue
      }

      // Encontra agentes com capacidade (<3 tickets)
      const availableTeamAgents = teamAgents.filter((a) => {
        const load = agentLoadMap[a.id] || 0
        return load < 3
      })

      if (!availableTeamAgents.length) {
        // Todos ocupados → permanece na fila
        continue
      }

      // Escolhe o agente com menor carga
      const agent = availableTeamAgents.sort(
        (a, b) => (agentLoadMap[a.id] || 0) - (agentLoadMap[b.id] || 0),
      )[0]

      if (!agent) continue

      // Atribui
      await this.ticketService.assign(ticket.id, agent.id!)

      // Incrementa carga
      agentLoadMap[agent.id] = (agentLoadMap[agent.id] || 0) + 1

      this.events.publish('ticket.assigned', {
        ticketId: ticket.id,
        agentId: agent.id,
        team: targetTeam.name,
      })
    }
  }
}
