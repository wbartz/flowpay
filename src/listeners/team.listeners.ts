import { eventBus } from '@/events/eventBus'
import { EVENTS } from '@/events/events'
import type { TeamService } from '@/modules/team/team.service'

export function registerTeamListeners(teamService: TeamService) {
  eventBus.on(EVENTS.AGENT_ADDED, async (agent) => {
    await teamService.addAgent(agent.teamId, agent.id)
  })

  eventBus.on(EVENTS.AGENT_REMOVED, async (agent) => {
    await teamService.removeAgent(agent.teamId, agent.id)
  })
}
