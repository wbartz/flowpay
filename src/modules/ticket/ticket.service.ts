// src/modules/ticket/ticket.service.ts
import { EventBus } from '@/events/eventBus'
import { ticketRepository } from './ticket.repository'
import { teamRepository } from '@/modules/team/team.repository'
import { agentRepository } from '@/modules/agent/agent.repository'
import type { Ticket } from './ticket.entity'

export class TicketService {
  constructor(private eventBus: EventBus) {}

  async create(data: Omit<Ticket, 'id'>) {
    const ticket = await ticketRepository.create(data)

    await this.eventBus.publish('ticket.created', {
      id: ticket.id,
      teamId: ticket.teamId,
    })

    return ticket
  }

  async autoDistribute(teamId: string) {
    const team = await teamRepository.findById(teamId)
    if (!team) return

    const agents = await agentRepository.list()
    const teamAgents = agents.filter((a) => a.teamId === teamId)

    for (const agent of teamAgents) {
      const assigned = (await ticketRepository.list()).filter(
        (t) => t.agentId === agent.id,
      )

      if (assigned.length >= 3) continue

      const nextTicket = await ticketRepository.popNext()
      if (!nextTicket) return

      await ticketRepository.update(nextTicket.id, {
        agentId: agent.id,
      })

      await this.eventBus.publish('ticket.assigned', {
        ticketId: nextTicket.id,
        agentId: agent.id,
        teamId,
      })
    }
  }

  async returnToQueue(ticketId: string) {
    await ticketRepository.returnToQueue(ticketId)
  }

  async unassignAgent(agentId: string) {
    const freed = await ticketRepository.unassignFromAgent(agentId)

    await this.eventBus.publish('agent.removed', {
      agentId,
      freedTickets: freed,
    })

    return freed
  }
}

export const ticketService = new TicketService(new EventBus())
