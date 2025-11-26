import { teamService } from '@/modules/team/team.service'
import { teamRepository } from '@/modules/team/team.repository'

jest.mock('../../src/modules/team/team.repository', () => ({
  teamRepository: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
  },
}))

describe('TeamService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('cria time', async () => {
    ;(teamRepository.create as jest.Mock).mockResolvedValue({
      id: 'team1',
      name: 'Time A',
      type: 'card',
      agents: [],
    })

    const team = await teamService.create({ name: 'Time A', type: 'card' })
    expect(team?.type).toBe('card')
    expect(team?.name).toBe('Time A')
  })

  test('atualiza time', async () => {
    ;(teamRepository.getById as jest.Mock).mockResolvedValue({
      id: 'team1',
      name: 'Time A',
      type: 'card',
      agents: [],
    })
    ;(teamRepository.update as jest.Mock).mockResolvedValue({
      id: 'team1',
      name: 'Time B',
      type: 'card',
      agents: [],
    })

    const team = await teamService.update('team1', { name: 'Time B' })
    expect(team?.name).toBe('Time B')
  })
})
