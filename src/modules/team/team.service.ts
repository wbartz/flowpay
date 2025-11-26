import { TeamRepository } from './team.repository'
import type { Team } from './team.entity'

export class TeamService {
  constructor(private repo: TeamRepository) {}

  async createTeam(name: string): Promise<Team> {
    return this.repo.create(name)
  }

  async listTeams(): Promise<Team[]> {
    return this.repo.list()
  }

  async addAgent(teamId: string, agentId: string): Promise<Team | null> {
    const team = await this.repo.findById(teamId)
    if (!team) return null
    team.agents.push(agentId)
    return this.repo.update(team)
  }

  async removeAgent(teamId: string, agentId: string): Promise<Team | null> {
    const team = await this.repo.findById(teamId)
    if (!team) return null
    team.agents = team.agents.filter((id) => id !== agentId)
    return this.repo.update(team)
  }
}
