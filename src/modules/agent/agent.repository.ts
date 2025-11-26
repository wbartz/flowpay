import type { Agent } from './agent.entity'

export class AgentRepository {
  private agents: Agent[] = []

  async create(data: Partial<Agent>): Promise<Agent> {
    const agent: Agent = {
      id: crypto.randomUUID(),
      name: data.name || 'unknown',
      teamId: data.teamId,
      capacity: data.capacity ?? 3,
      assignedTickets: [],
      createdAt: new Date(),
    }
    this.agents.push(agent)
    return agent
  }

  async list(): Promise<Agent[]> {
    return this.agents
  }

  async findById(id: string): Promise<Agent | undefined> {
    return this.agents.find((a) => a.id === id)
  }

  async update(agent: Agent): Promise<Agent> {
    const idx = this.agents.findIndex((a) => a.id === agent.id)
    if (idx !== -1) this.agents[idx] = agent
    return agent
  }

  async remove(id: string): Promise<Agent | null | any> {
    const idx = this.agents.findIndex((a) => a.id === id)
    if (idx === -1) return null
    const removed = this.agents[idx]
    this.agents.splice(idx, 1)
    return removed
  }
}

export const agentRepository = new AgentRepository()
