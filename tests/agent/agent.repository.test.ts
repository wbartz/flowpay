import { agentRepository } from '@/modules/agent/agent.repository'

describe('AgentRepository', () => {
  beforeEach(() => {
    ;(agentRepository as any).agents.clear()
    ;(agentRepository as any).idCounter = 1
  })

  test('cria agente com id incremental', async () => {
    const agent1 = await agentRepository.create({ name: 'Ana' })
    const agent2 = await agentRepository.create({ name: 'Bruno' })

    expect(agent1.id).toBeTruthy()
    expect(agent2.id).toBeTruthy()
  })

  test('atualiza agente corretamente', async () => {
    const agent = await agentRepository.create({ name: 'Ana' })
    const updated = await agentRepository.update(agent.id, { name: 'Ana B' })
    expect(updated?.name).toBe('Ana B')
  })

  test('lista agentes corretamente', async () => {
    await agentRepository.create({ name: 'Ana' })
    await agentRepository.create({ name: 'Bruno' })
    const list = await agentRepository.list()
    expect(list.length).toBe(2)
  })

  test('deleta agente corretamente', async () => {
    const agent = await agentRepository.create({ name: 'Ana' })
    const deleted = await agentRepository.delete(agent.id)
    expect(deleted).toBe(true)
    const get = await agentRepository.getById(agent.id)
    expect(get).toBeNull()
  })
})
