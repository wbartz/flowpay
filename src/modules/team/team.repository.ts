import type { Team } from './team.entity'

export class TeamRepository {
  private teams = new Map<string, Team>()

  async create(data: Omit<Team, 'id' | 'agents' | 'createdAt'>): Promise<Team> {
    const team: Team = {
      id: crypto.randomUUID(),
      type: data.type,
      name: data.name,
      agents: [],
      createdAt: new Date(),
    }
    this.teams.set(team.id, team)
    return team
  }

  async list(): Promise<Team[]> {
    return Array.from(this.teams.values())
  }

  async getById(id: string): Promise<Team | null> {
    return this.teams.get(id) ?? null
  }

  async delete(id: string): Promise<boolean> {
    return this.teams.delete(id)
  }

  async update(id: string, data: Partial<Team>): Promise<Team | null> {
    const team = this.teams.get(id)
    if (!team) return null
    const updated = { ...team, ...data }
    this.teams.set(id, updated)
    return updated
  }
}

export const teamRepository = new TeamRepository()
