import { TicketRepository } from './ticket.repository'
import type { CreateTicketDTO } from './ticket.schema'
import type { Ticket } from './ticket.entity'

export class TicketService {
  constructor(private repo: TicketRepository) {}

  async createTicket(data: CreateTicketDTO): Promise<Ticket> {
    return this.repo.create(data)
  }

  async assignTicket(id: string, agentId: string): Promise<Ticket | null> {
    const ticket = await this.repo.findById(id)
    if (!ticket) return null

    ticket.status = 'assigned'
    return this.repo.update(ticket)
  }

  async closeTicket(id: string): Promise<Ticket | null> {
    const ticket = await this.repo.findById(id)
    if (!ticket) return null

    ticket.status = 'closed'
    return this.repo.update(ticket)
  }

  listTickets(): Promise<Ticket[]> {
    return this.repo.list()
  }

  listQueued(): Promise<Ticket[]> {
    return this.repo.listQueued()
  }
}
