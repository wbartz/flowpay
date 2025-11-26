// src/modules/ticket/ticket.service.ts
import { eventBus, EventBus } from '@/events/eventBus'
import { ticketRepository } from './ticket.repository'
import type { Ticket } from './ticket.entity'

export class TicketService {
  constructor(private eventBus: EventBus) {}

  async create(
    data: Omit<
      Ticket,
      'id' | 'number' | 'createdAt' | 'agentId' | 'status' | 'teamId'
    >,
  ) {
    const ticket = await ticketRepository.create(data)

    await this.eventBus.publish('ticket.created', {
      id: ticket.id,
      teamId: ticket.teamId,
    })

    return ticket
  }

  async listQueue(): Promise<Ticket[]> {
    return ticketRepository.listQueue()
  }

  async returnToQueue(ticketId: string) {
    await ticketRepository.returnToQueue(ticketId)
  }

  async getUnassigned(): Promise<Ticket[]> {
    return ticketRepository.getUnassigned()
  }

  async assign(ticketId: string, agentId: string) {
    const ticket = await ticketRepository.update(ticketId, {
      agentId,
      status: 'assigned',
    })
    if (!ticket) throw new Error('Ticket not found')

    await this.eventBus.publish('ticket.assigned', {
      ticketId: ticket.id,
      agentId,
    })

    return ticket
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

export const ticketService = new TicketService(eventBus)
