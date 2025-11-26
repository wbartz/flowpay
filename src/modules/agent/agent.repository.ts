import type { Agent } from './agent.entity'

export class AgentRepository {
  private agents = new Map<string, Agent>()

  async create(
    data: Omit<
      Agent,
      'id' | 'createdAt' | 'assignedTickets' | 'teamId' | 'maxTickets'
    >,
  ): Promise<Agent> {
    const id = crypto.randomUUID()
    const agent: Agent = {
      id,
      ...data,
      createdAt: new Date(),
      maxTickets: 3,
      assignedTickets: [],
    }
    this.agents.set(id, agent)
    return agent
  }

  async getById(id: string): Promise<Agent | null> {
    return this.agents.get(id) ?? null
  }

  async update(id: string, data: Partial<Agent>): Promise<Agent | null> {
    const agent = this.agents.get(id)
    if (!agent) return null
    const updated = { ...agent, ...data }
    this.agents.set(id, updated)
    return updated
  }

  async list(): Promise<Agent[]> {
    return Array.from(this.agents.values())
  }

  async delete(id: string): Promise<boolean> {
    return this.agents.delete(id)
  }

  async getAvailableAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values()).filter(
      (agent) => agent.assignedTickets.length < agent.maxTickets,
    )
  }
}

export const agentRepository = new AgentRepository()
