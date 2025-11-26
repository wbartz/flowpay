import { teamRepository } from './team.repository'
import type { Team } from './team.entity'
import { eventBus, type EventBus } from '@/events/eventBus'
import { agentRepository } from '../agent/agent.repository'

export class TeamService {
  constructor(private eventBus: EventBus) {}

  async create(data: Omit<Team, 'id' | 'agents' | 'createdAt'>): Promise<Team> {
    const team = await teamRepository.create(data)
    return team
  }

  async list(): Promise<Team[]> {
    return teamRepository.list()
  }

  async update(id: string, data: Partial<Team>) {
    const team = await teamRepository.getById(id)
    if (!team) return null
    const updated = await teamRepository.update(id, data)
    return updated
  }

  async addAgent(teamId: string, agentId: string): Promise<Team | null> {
    const agent = await agentRepository.getById(agentId)
    const team = await teamRepository.getById(teamId)
    if (!team || !agent) return null
    team.agents.push(agent.id)
    const updated = await teamRepository.update(teamId, team)
    if (updated) {
      await this.eventBus.publish('team.agent.assigned', { teamId, agentId })
    }
    return updated
  }

  async removeAgent(teamId: string, agentId: string): Promise<Team | null> {
    const agent = await agentRepository.getById(agentId)
    const team = await teamRepository.getById(teamId)
    if (!team || !agent) return null
    team.agents = team.agents.filter((id) => id !== agentId)
    const updated = await teamRepository.update(teamId, team)

    if (updated) {
      await this.eventBus.publish('team.agent.removed', { teamId, agentId })
    }
    return updated
  }
}

export const teamService = new TeamService(eventBus)
