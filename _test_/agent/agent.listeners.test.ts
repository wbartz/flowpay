import { EventBus } from '@/events/eventBus'
import type { Agent } from '@/modules/agent/agent.entity'
import { AgentListeners } from '@/modules/agent/agent.listeners'
import { AgentService } from '@/modules/agent/agent.service'

describe('AgentListeners atualizado', () => {
  let eventBus: EventBus
  let agentService: jest.Mocked<AgentService>
  let listeners: AgentListeners
  let defaultAgent: Agent

  beforeEach(() => {
    eventBus = new EventBus()
    agentService = {
      getById: jest.fn(),
      update: jest.fn(),
    } as any

    listeners = new AgentListeners(eventBus, agentService)
    listeners.register()
    defaultAgent = {
      id: 'A1',
      name: 'Agent 1',
      teamId: 'old',
      assignedTickets: [],
      maxTickets: 3,
      createdAt: new Date(),
    }
    agentService.getById.mockResolvedValue(defaultAgent)
  })

  test('team.created dispara log mas não altera agente', async () => {
    await eventBus.publish('team.created', { id: 'T1' })
    expect(agentService.update).not.toHaveBeenCalled()
  })

  test('team.updated atualiza agentes corretos', async () => {
    await eventBus.publish('team.updated', { id: 'T1', agents: ['A1'] })
    expect(agentService.update).toHaveBeenCalledWith('A1', { teamId: 'T1' })
  })

  test('team.agent.assigned atualiza agente', async () => {
    await eventBus.publish('team.agent.assigned', {
      teamId: 'T1',
      agentId: 'A1',
    })
    expect(agentService.update).toHaveBeenCalledWith('A1', { teamId: 'T1' })
  })

  test('team.agent.removed atualiza agente removendo teamId', async () => {
    await eventBus.publish('team.agent.removed', {
      teamId: 'old',
      agentId: 'A1',
    })
    expect(agentService.getById).toHaveBeenCalledWith('A1')
    expect(agentService.update).toHaveBeenCalledWith('A1', { teamId: null })
  })
})
