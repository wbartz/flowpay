import type { Ticket } from './ticket.entity'

class TicketRepository {
  private tickets = new Map<string, Ticket>()
  private queue: string[] = []
  private idCounter = 1

  async create(data: Omit<Ticket, 'id'>): Promise<Ticket> {
    const id = crypto.randomUUID()
    const number = this.idCounter++
    const ticket: Ticket = { ...data, id, number, agentId: null }

    this.tickets.set(id, ticket)
    this.queue.push(id)

    return ticket
  }

  async getById(id: string): Promise<Ticket | null> {
    return this.tickets.get(id) ?? null
  }

  async update(id: string, data: Partial<Ticket>): Promise<Ticket | null> {
    const existing = this.tickets.get(id)
    if (!existing) return null

    const updated = { ...existing, ...data }
    this.tickets.set(id, updated)
    return updated
  }

  async list(): Promise<Ticket[]> {
    return Array.from(this.tickets.values())
  }

  async listQueue(): Promise<Ticket[]> {
    return this.queue.map((id) => this.tickets.get(id)!)
  }

  async popNext(): Promise<Ticket | null> {
    const id = this.queue.shift()
    if (!id) return null
    return this.tickets.get(id) ?? null
  }

  async returnToQueue(ticketId: string) {
    // devolve para o início
    this.queue.unshift(ticketId)
  }

  async unassignFromAgent(agentId: string): Promise<string[]> {
    const freed: string[] = []

    for (const ticket of this.tickets.values()) {
      if (ticket.agentId === agentId) {
        ticket.agentId = null
        freed.push(ticket.id)
        this.queue.unshift(ticket.id)
      }
    }

    return freed
  }
}

export const ticketRepository = new TicketRepository()
