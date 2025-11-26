import { agentRepository } from './agent.repository'
import { eventBus, EventBus } from '@/events/eventBus'
import type { Agent } from './agent.entity'

export class AgentService {
  constructor(private eventBus: EventBus) {}

  async create(
    data: Omit<Agent, 'id' | 'createdAt' | 'teamId' | 'assignedTickets'>,
  ): Promise<Agent> {
    const agent = await agentRepository.create(data)
    await this.eventBus.publish('agent.created', agent)
    return agent
  }

  async update(id: string, data: Partial<Agent>) {
    const agent = await agentRepository.getById(id)
    if (!agent) return null
    const updated = await agentRepository.update(id, data)
    if (updated) {
      await this.eventBus.publish('agent.updated', updated)
    }
    return updated
  }

  async getById(id: string) {
    return agentRepository.getById(id)
  }

  async list() {
    return agentRepository.list()
  }

  async delete(id: string) {
    const agent = await this.getById(id)
    if (!agent) return false

    const deleted = await agentRepository.delete(id)
    if (deleted) {
      await this.eventBus.publish('agent.deleted', agent)
    }
    return deleted
  }

  async getAvailableAgents() {
    return await agentRepository.getAvailableAgents()
  }
}

export const agentService = new AgentService(eventBus)
