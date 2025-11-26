import type { Team } from './team.entity'

export class TeamRepository {
  private teams: Team[] = []

  async create(name: string): Promise<Team> {
    const team: Team = {
      id: crypto.randomUUID(),
      name,
      agents: [],
      createdAt: new Date(),
    }
    this.teams.push(team)
    return team
  }

  async list(): Promise<Team[]> {
    return this.teams
  }

  async findById(id: string): Promise<Team | undefined> {
    return this.teams.find((t) => t.id === id)
  }

  async update(team: Team): Promise<Team> {
    const index = this.teams.findIndex((t) => t.id === team.id)
    if (index !== -1) this.teams[index] = team
    return team
  }
}
