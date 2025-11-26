// tests/ticket/ticket.service.test.ts
import { TicketRepository } from '@/modules/ticket/ticket.repository'
import { TicketService } from '@/modules/ticket/ticket.service'
import { faker } from '@faker-js/faker'

describe('TicketService', () => {
  let repo: TicketRepository
  let service: TicketService

  beforeEach(() => {
    repo = new TicketRepository()
    service = new TicketService(repo)
  })

  test('should create a ticket with sequential number', async () => {
    const t1 = await service.createTicket({
      subject: 'Card Issue',
      description: 'Card not working',
    })

    const t2 = await service.createTicket({
      subject: 'Loan Request',
      description: 'Need money',
    })

    expect(t1.number).toBe(1)
    expect(t2.number).toBe(2)
  })

  test('should list all tickets', async () => {
    await service.createTicket({ subject: 'Test 1', description: 'Desc 1' })
    await service.createTicket({ subject: 'Test 2', description: 'Desc 2' })

    const list = await service.listTickets()
    expect(list).toHaveLength(2)
  })

  test('should return only queued tickets in order', async () => {
    await service.createTicket({ subject: 'A', description: 'A' })
    await service.createTicket({ subject: 'B', description: 'B' })
    await service.createTicket({ subject: 'C', description: 'C' })

    const queued = await service.listQueued()

    expect(queued.length).toBe(3)
    expect(queued[0].number).toBe(1)
    expect(queued[2].number).toBe(3)
  })

  test('should assign a ticket', async () => {
    const t = await service.createTicket({ subject: 'A', description: 'A' })

    const assigned = await service.assignTicket(t.id, faker.string.uuid())

    expect(assigned?.status).toBe('assigned')
  })

  test('should close a ticket', async () => {
    const t = await service.createTicket({ subject: 'A', description: 'A' })

    const closed = await service.closeTicket(t.id)

    expect(closed?.status).toBe('closed')
  })

  test('assign should return null for non-existent ticket', async () => {
    const res = await service.assignTicket('unknown', faker.string.uuid())
    expect(res).toBeNull()
  })

  test('close should return null for non-existent ticket', async () => {
    const res = await service.closeTicket('unknown')
    expect(res).toBeNull()
  })
})
