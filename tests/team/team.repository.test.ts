import { TeamRepository } from '@/modules/team/team.repository'

describe('TeamRepository', () => {
  let teamRepository: TeamRepository

  beforeEach(() => {
    teamRepository = new TeamRepository()
  })

  test('cria team com ID incremental', async () => {
    const t1 = await teamRepository.create({ name: 'Cartões', type: 'card' })
    const t2 = await teamRepository.create({
      name: 'Empréstimos',
      type: 'loan',
    })

    expect(t1.id).toBeTruthy()
    expect(t2.id).toBeTruthy()
  })

  test('atualiza dados do time', async () => {
    const team = await teamRepository.create({ name: 'Cartões', type: 'card' })
    team.name = 'Novo Nome'
    const updated = await teamRepository.update(team.id, team)

    expect(updated?.name).toBe('Novo Nome')
  })

  test('lista corretamente', async () => {
    await teamRepository.create({ name: 'Cartões', type: 'card' })
    await teamRepository.create({ name: 'Outros', type: 'other' })

    const list = await teamRepository.list()
    expect(list.length).toBe(2)
  })

  test('remove time', async () => {
    const team = await teamRepository.create({ name: 'Cartões', type: 'card' })
    const removed = await teamRepository.delete(team.id)

    expect(removed).toBe(true)
    const get = await teamRepository.getById(team.id)
    expect(get).toBeNull()
  })
})
