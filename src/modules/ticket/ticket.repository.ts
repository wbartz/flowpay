import type { Ticket } from './ticket.entity'

export class TicketRepository {
  private tickets: Ticket[] = []
  private lastNumber = 0

  async create(
    data: Omit<Ticket, 'id' | 'number' | 'createdAt' | 'status'>,
  ): Promise<Ticket> {
    const ticket: Ticket = {
      id: crypto.randomUUID(),
      number: ++this.lastNumber,
      subject: data.subject,
      description: data.description,
      teamId: data.teamId,
      status: 'queued',
      createdAt: new Date(),
    }
    this.tickets.push(ticket)
    return ticket
  }

  async list(): Promise<Ticket[]> {
    return this.tickets
  }

  async findById(id: string): Promise<Ticket | undefined> {
    return this.tickets.find((t) => t.id === id)
  }

  async update(ticket: Ticket): Promise<Ticket> {
    const i = this.tickets.findIndex((t) => t.id === ticket.id)
    if (i !== -1) this.tickets[i] = ticket
    return ticket
  }

  async listQueued(): Promise<Ticket[]> {
    return this.tickets
      .filter((t) => t.status === 'queued')
      .sort((a, b) => a.number - b.number)
  }
}
