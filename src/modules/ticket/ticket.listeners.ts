import { EventBus } from '@/events/eventBus'
import { TicketService } from './ticket.service'

export class TicketListeners {
  constructor(
    private readonly eventBus: EventBus,
    private readonly ticketService: TicketService,
  ) {}

  register() {
    // Quando um ticket é criado → tentar distribuição automática
    this.eventBus.subscribe('ticket.created', async (payload: any) => {
      const { teamId } = payload
      if (!teamId) return
      await this.ticketService.autoDistribute(teamId)
    })

    // Quando um agente é removido → retornar tickets e redistribuir
    this.eventBus.subscribe('agent.removed', async (payload: any) => {
      const { teamId, freedTickets } = payload

      if (Array.isArray(freedTickets)) {
        for (const ticketId of freedTickets) {
          await this.ticketService.returnToQueue(ticketId)
        }
      }

      if (teamId) {
        await this.ticketService.autoDistribute(teamId)
      }
    })

    // Quando um agente é adicionado → redistribuir fila
    this.eventBus.subscribe('agent.added', async ({ teamId }) => {
      if (!teamId) return
      await this.ticketService.autoDistribute(teamId)
    })

    // Quando time é atualizado → redistribuir
    this.eventBus.subscribe('team.updated', async ({ id: teamId }) => {
      if (!teamId) return
      await this.ticketService.autoDistribute(teamId)
    })
  }
}

export const registerTicketListeners = (
  eventBus: EventBus,
  ticketService: TicketService,
) => {
  const listeners = new TicketListeners(eventBus, ticketService)
  listeners.register()
  return listeners
}
