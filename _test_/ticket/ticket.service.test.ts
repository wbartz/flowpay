import { EventBus } from '@/events/eventBus'
import { TicketService } from '@/modules/ticket/ticket.service'
import { ticketRepository } from '@/modules/ticket/ticket.repository'

jest.mock('@/modules/ticket/ticket.repository', () => ({
  ticketRepository: {
    create: jest.fn(),
    update: jest.fn(),
    getById: jest.fn(),
    list: jest.fn(),
    listQueue: jest.fn(),
    popNext: jest.fn(),
    returnToQueue: jest.fn(),
    unassignFromAgent: jest.fn(),
    getUnassigned: jest.fn(),
  },
}))

describe('TicketService', () => {
  let eventBus: EventBus
  let service: TicketService

  beforeEach(() => {
    jest.clearAllMocks()
    eventBus = new EventBus()
    service = new TicketService(eventBus)
  })

  test('create cria ticket e emite evento', async () => {
    const publish = jest.spyOn(eventBus, 'publish')
    ;(ticketRepository.create as jest.Mock).mockResolvedValue({
      id: '1',
      subject: 'X',
      teamId: 'T1',
    })
    const ticket = await service.create({ subject: 'X', teamId: 'T1' })
    expect(ticket.id).toBe('1')
    expect(publish).toHaveBeenCalledWith('ticket.created', {
      id: '1',
      teamId: 'T1',
    })
  })

  test('listQueue retorna tickets da fila', async () => {
    ;(ticketRepository.listQueue as jest.Mock).mockResolvedValue([{ id: '1' }])
    const result = await service.listQueue()
    expect(result).toEqual([{ id: '1' }])
    expect(ticketRepository.listQueue).toHaveBeenCalled()
  })

  test('getUnassigned retorna tickets não atribuídos', async () => {
    ;(ticketRepository.getUnassigned as jest.Mock).mockResolvedValue([
      { id: '2' },
    ])
    const result = await service.getUnassigned()
    expect(result).toEqual([{ id: '2' }])
    expect(ticketRepository.getUnassigned).toHaveBeenCalled()
  })

  test('returnToQueue chama método do repositório', async () => {
    const spy = jest.spyOn(ticketRepository, 'returnToQueue' as any)
    await service.returnToQueue('1')
    expect(spy).toHaveBeenCalledWith('1')
  })

  test('assign lança erro se ticket não existe', async () => {
    ;(ticketRepository.update as jest.Mock).mockResolvedValue(null)
    await expect(service.assign('X', 'A2')).rejects.toThrow('Ticket not found')
  })

  test('assign atribui ticket e emite evento', async () => {
    const publish = jest.spyOn(eventBus, 'publish')
    ;(ticketRepository.update as jest.Mock).mockResolvedValue({ id: '3' })
    const ticket = await service.assign('3', 'A1')
    expect(ticket.id).toBe('3')
    expect(ticketRepository.update).toHaveBeenCalledWith('3', {
      agentId: 'A1',
      status: 'assigned',
    })
    expect(publish).toHaveBeenCalledWith('ticket.assigned', {
      ticketId: '3',
      agentId: 'A1',
    })
  })

  test('unassignAgent desatribui e emite evento', async () => {
    const publish = jest.spyOn(eventBus, 'publish')
    ;(ticketRepository.unassignFromAgent as jest.Mock).mockResolvedValue([
      '4',
      '5',
    ])
    const freed = await service.unassignAgent('A3')
    expect(freed).toEqual(['4', '5'])
    expect(ticketRepository.unassignFromAgent).toHaveBeenCalledWith('A3')
    expect(publish).toHaveBeenCalledWith('agent.removed', {
      agentId: 'A3',
      freedTickets: ['4', '5'],
    })
  })
})
