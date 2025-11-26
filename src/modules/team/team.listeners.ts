// src/modules/team/team.listeners.ts
import { EventBus } from '../../core/eventBus'
import { TeamService } from './team.service'

export class TeamListeners {
  constructor(private eventBus: EventBus, private teamService: TeamService) {}

  register() {
    this.onAgentUpdated()
  }

  private onAgentUpdated() {
    this.eventBus.subscribe('agent.updated', async (agent) => {
      // se agent mudou de time, sincronizar Team.agents
      if (agent.teamId) {
        await this.teamService.ensureAgentInTeam(agent.teamId, agent.id)
      }

      // caso tenha sido removido de um time
      if (!agent.teamId) {
        await this.teamService.removeAgentFromAllTeams(agent.id)
      }
    })
  }
}
