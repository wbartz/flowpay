import { TeamListeners } from '@/modules/team/team.listeners'
import { EventBus } from '@/events/eventBus'
import { TeamService } from '@/modules/team/team.service'

describe('TeamListeners', () => {
  let eventBus: EventBus
  let teamService: jest.Mocked<TeamService>
  let listeners: TeamListeners

  beforeEach(() => {
    eventBus = new EventBus()

    teamService = {
      ensureAgentInTeam: jest.fn(),
      removeAgentFromAllTeams: jest.fn(),
    } as any

    listeners = new TeamListeners(eventBus, teamService)
    listeners.register()
  })

  test('garante que agent está no time ao receber agent.updated com teamId', async () => {
    await eventBus.publish('agent.updated', {
      id: 'agent1',
      teamId: 'teamA',
    })

    expect(teamService.ensureAgentInTeam).toHaveBeenCalledWith(
      'teamA',
      'agent1',
    )
  })

  test('remove agent do time ao receber agent.updated sem teamId', async () => {
    await eventBus.publish('agent.updated', {
      id: 'agent1',
      teamId: null,
    })

    expect(teamService.removeAgentFromAllTeams).toHaveBeenCalledWith('agent1')
  })
})
