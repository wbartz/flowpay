import { TicketListeners } from '@/modules/ticket/ticket.listeners'
import type { EventBus } from '@/events/eventBus'

const ticketService = {
  getUnassigned: jest.fn(),
  assign: jest.fn(),
} as any
const agentService = {
  getAvailableAgents: jest.fn(),
} as any
const teamService = {
  list: jest.fn(),
} as any

const eventBusMock = {
  subscribe: jest.fn(),
  publish: jest.fn(),
} as unknown as EventBus

describe('TicketListeners', () => {
  let listeners: TicketListeners

  beforeEach(() => {
    jest.clearAllMocks()
    listeners = new TicketListeners(
      eventBusMock,
      ticketService,
      agentService,
      teamService,
    )
  })

  test('register inscreve todos os eventos', () => {
    listeners.register()
    expect(eventBusMock.subscribe).toHaveBeenCalledWith(
      'ticket.created',
      expect.any(Function),
    )
    expect(eventBusMock.subscribe).toHaveBeenCalledWith(
      'ticket.updated',
      expect.any(Function),
    )
    expect(eventBusMock.subscribe).toHaveBeenCalledWith(
      'ticket.unassigned',
      expect.any(Function),
    )
    expect(eventBusMock.subscribe).toHaveBeenCalledWith(
      'agent.created',
      expect.any(Function),
    )
    expect(eventBusMock.subscribe).toHaveBeenCalledWith(
      'agent.updated',
      expect.any(Function),
    )
    expect(eventBusMock.subscribe).toHaveBeenCalledWith(
      'agent.removed',
      expect.any(Function),
    )
    expect(eventBusMock.subscribe).toHaveBeenCalledWith(
      'team.memberAdded',
      expect.any(Function),
    )
    expect(eventBusMock.subscribe).toHaveBeenCalledWith(
      'team.memberRemoved',
      expect.any(Function),
    )
    expect(eventBusMock.subscribe).toHaveBeenCalledWith(
      'team.removed',
      expect.any(Function),
    )
  })

  test('handleQueueReprocess não faz nada se não há tickets', async () => {
    ticketService.getUnassigned.mockResolvedValue([])
    await listeners['handleQueueReprocess']()
    expect(agentService.getAvailableAgents).not.toHaveBeenCalled()
    expect(teamService.list).not.toHaveBeenCalled()
  })

  test('handleQueueReprocess atribui ticket ao agente disponível', async () => {
    ticketService.getUnassigned.mockResolvedValue([
      { id: 1, subject: 'Problemas com cartão', agentId: null },
    ])
    agentService.getAvailableAgents.mockResolvedValue([{ id: 10 }])
    teamService.list.mockResolvedValue([{ name: 'Cartões', agents: [10] }])
    ticketService.assign.mockResolvedValue(true)

    await listeners['handleQueueReprocess']()
    expect(ticketService.assign).toHaveBeenCalledWith(1, 10)
    expect(eventBusMock.publish).toHaveBeenCalledWith(
      'ticket.assigned',
      expect.objectContaining({ ticketId: 1, agentId: 10, team: 'Cartões' }),
    )
  })

  test('handleQueueReprocess não atribui se todos agentes ocupados', async () => {
    ticketService.getUnassigned.mockResolvedValue([
      { id: 2, subject: 'Problemas com cartão', agentId: null },
    ])
    agentService.getAvailableAgents.mockResolvedValue([{ id: 20 }])
    teamService.list.mockResolvedValue([{ name: 'Cartões', agents: [20] }])
    // Simula agente já com 3 tickets
    ticketService.getUnassigned.mockResolvedValue([
      { id: 2, agentId: null },
      { id: 3, agentId: 20 },
      { id: 4, agentId: 20 },
      { id: 5, agentId: 20 },
    ])

    await listeners['handleQueueReprocess']()
    expect(ticketService.assign).not.toHaveBeenCalled()
    expect(eventBusMock.publish).not.toHaveBeenCalled()
  })
})
