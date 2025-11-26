import { EventBus } from '@/events/eventBus'
import { TicketListeners } from '@/modules/ticket/ticket.listeners'
import { TicketService } from '@/modules/ticket/ticket.service'

describe('TicketListeners', () => {
  let eventBus: EventBus
  let ticketService: jest.Mocked<TicketService>
  let listeners: TicketListeners

  beforeEach(() => {
    eventBus = new EventBus()
    ticketService = {
      autoDistribute: jest.fn(),
      returnToQueue: jest.fn(),
    } as any

    listeners = new TicketListeners(eventBus, ticketService)
    listeners.register()
  })

  test('ticket.created → aciona autoDistribute', async () => {
    await eventBus.publish('ticket.created', { teamId: 'T1' })
    expect(ticketService.autoDistribute).toHaveBeenCalledWith('T1')
  })

  test('agent.removed → retorna tickets e redistribui', async () => {
    await eventBus.publish('agent.removed', {
      teamId: 'T1',
      freedTickets: ['TK1', 'TK2'],
    })

    expect(ticketService.returnToQueue).toHaveBeenCalledTimes(2)
    expect(ticketService.autoDistribute).toHaveBeenCalledWith('T1')
  })

  test('agent.removed sem freedTickets não falha', async () => {
    await eventBus.publish('agent.removed', { teamId: 'T1' })
    expect(ticketService.autoDistribute).toHaveBeenCalledWith('T1')
  })
})
