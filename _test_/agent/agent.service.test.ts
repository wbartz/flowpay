import { EventBus } from '@/events/eventBus'
import { AgentService } from '@/modules/agent/agent.service'
import { agentRepository } from '@/modules/agent/agent.repository'
import type { Agent } from '@/modules/agent/agent.entity'

jest.mock('@/modules/agent/agent.repository', () => ({
  agentRepository: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
  },
}))

describe('AgentService', () => {
  let eventBus: EventBus
  let service: AgentService
  let defaultAgent: Agent

  beforeEach(() => {
    jest.clearAllMocks()
    eventBus = new EventBus()
    service = new AgentService(eventBus)
    defaultAgent = {
      id: '1',
      name: 'Ana',
      teamId: null,
      maxTickets: 3,
      assignedTickets: [],
      createdAt: new Date(),
    }
    ;(agentRepository.getById as jest.Mock).mockResolvedValue(defaultAgent)
    ;(agentRepository.create as jest.Mock).mockResolvedValue(defaultAgent)
  })

  test('cria agente e emite evento', async () => {
    const publishSpy = jest.spyOn(eventBus, 'publish')

    const agent = await service.create(defaultAgent)

    expect(agent.id).toBe('1')
    expect(publishSpy).toHaveBeenCalledWith('agent.created', agent)
  })

  test('atualiza agente e emite evento', async () => {
    const publishSpy = jest.spyOn(eventBus, 'publish')

    ;(agentRepository.update as jest.Mock).mockResolvedValue({
      ...defaultAgent,
      name: 'Ana B',
    })

    const updated = await service.update('1', { name: 'Ana B' })
    expect(updated?.name).toBe('Ana B')
    expect(publishSpy).toHaveBeenCalledWith('agent.updated', updated)
  })

  test('deleta agente e emite evento', async () => {
    const publishSpy = jest.spyOn(eventBus, 'publish')
    ;(agentRepository.delete as jest.Mock).mockResolvedValue(true)

    const result = await service.delete('1')
    expect(result).toBe(true)
    expect(publishSpy).toHaveBeenCalledWith('agent.deleted', defaultAgent)
  })

  test('deleta agente inexistente retorna false', async () => {
    ;(agentRepository.getById as jest.Mock).mockResolvedValue(null)
    const result = await service.delete('999')
    expect(result).toBe(false)
  })
})
