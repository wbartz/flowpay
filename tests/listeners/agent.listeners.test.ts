import { EventBus } from '@/events/eventBus'
import { AgentListeners } from '@/modules/agent/agent.listeners'
import { AgentService } from '@/modules/agent/agent.service'

describe('AgentListeners atualizado', () => {
  let eventBus: EventBus
  let agentService: jest.Mocked<AgentService>
  let listeners: AgentListeners

  beforeEach(() => {
    eventBus = new EventBus()
    agentService = {
      getById: jest.fn(),
      update: jest.fn(),
    } as any

    listeners = new AgentListeners(eventBus, agentService)
    listeners.register()
  })

  test('team.created dispara log mas não altera agente', async () => {
    await eventBus.publish('team.created', { id: 'T1' })
    expect(agentService.update).not.toHaveBeenCalled()
  })

  test('team.updated atualiza agentes corretos', async () => {
    agentService.getById.mockResolvedValue({ id: 'A1', teamId: 'old' })

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
    agentService.getById.mockResolvedValue({ id: 'A1', teamId: 'T1' })

    await eventBus.publish('team.agent.removed', {
      teamId: 'T1',
      agentId: 'A1',
    })
    expect(agentService.update).toHaveBeenCalledWith('A1', { teamId: null })
  })
})
