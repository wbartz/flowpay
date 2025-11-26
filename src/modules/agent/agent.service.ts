import { AgentRepository } from './agent.repository'
import type { Agent } from './agent.entity'

export class AgentService {
  constructor(private repo: AgentRepository) {}

  async createAgent(data: {
    name: string
    teamId?: string
    capacity?: number
  }): Promise<Agent> {
    return this.repo.create(data)
  }

  async listAgents(): Promise<Agent[]> {
    return this.repo.list()
  }

  async getAgent(id: string): Promise<Agent | null> {
    const a = await this.repo.findById(id)
    return a ?? null
  }

  async removeAgent(id: string): Promise<Agent | null> {
    return this.repo.remove(id)
  }

  async assignTicketToAgent(
    agentId: string,
    ticketId: string,
  ): Promise<Agent | null> {
    const agent = await this.repo.findById(agentId)
    if (!agent) return null
    if (agent.assignedTickets.length >= agent.capacity)
      throw new Error('Agent at full capacity')
    agent.assignedTickets.push(ticketId)
    await this.repo.update(agent)
    return agent
  }

  async releaseTicketFromAgent(
    agentId: string,
    ticketId?: string,
  ): Promise<string | null> {
    const agent = await this.repo.findById(agentId)
    if (!agent) return null
    if (!ticketId) ticketId = agent.assignedTickets.shift()
    const idx = agent.assignedTickets.findIndex((t) => t === ticketId)
    if (idx !== -1) agent.assignedTickets.splice(idx, 1)
    await this.repo.update(agent)
    return ticketId ?? null
  }
}
