// src/modules/agent/agent.listeners.ts
import { EventBus } from '../../core/eventBus'
import { AgentService } from './agent.service'

export class AgentListeners {
  constructor(private eventBus: EventBus, private agentService: AgentService) {}

  register() {
    this.onTeamCreated()
    this.onTeamUpdated()
    this.onAgentAddedToTeam()
    this.onAgentRemovedFromTeam()
  }

  private onTeamCreated() {
    this.eventBus.subscribe('team.created', async (team) => {
      // Nenhuma lógica obrigatória, mas poderia ser usado futuramente
      console.log(`[AgentListeners] team.created recebido: ${team.id}`)
    })
  }

  private onTeamUpdated() {
    this.eventBus.subscribe('team.updated', async (team) => {
      console.log(`[AgentListeners] team.updated recebido: ${team.id}`)

      // Garantir que todos os agents do team existem e estão atualizados
      if (team.agents && team.agents.length > 0) {
        for (const agentId of team.agents) {
          const agent = await this.agentService.getById(agentId)
          if (!agent) continue

          if (agent.teamId !== team.id) {
            await this.agentService.update(agent.id, { teamId: team.id })
          }
        }
      }
    })
  }

  private onAgentAddedToTeam() {
    this.eventBus.subscribe(
      'team.agent.assigned',
      async ({ teamId, agentId }) => {
        console.log(
          `[AgentListeners] team.agent.assigned recebido: agent=${agentId}, team=${teamId}`,
        )

        await this.agentService.update(agentId, { teamId })
      },
    )
  }

  private onAgentRemovedFromTeam() {
    this.eventBus.subscribe(
      'team.agent.removed',
      async ({ teamId, agentId }) => {
        console.log(
          `[AgentListeners] team.agent.removed recebido: agent=${agentId}, team=${teamId}`,
        )

        const agent = await this.agentService.getById(agentId)
        if (!agent) return

        if (agent.teamId === teamId) {
          await this.agentService.update(agentId, { teamId: null })
        }
      },
    )
  }
}
