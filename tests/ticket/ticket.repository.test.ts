import { ticketRepository } from '@/modules/ticket/ticket.repository'
import type { Ticket } from '@/modules/ticket/ticket.entity'

describe('TicketRepository', () => {
  let ticketData: Omit<
    Ticket,
    'id' | 'number' | 'createdAt' | 'agentId' | 'status' | 'teamId'
  >

  beforeEach(() => {
    // Limpa estado interno
    // @ts-ignore
    ticketRepository.tickets.clear()
    // @ts-ignore
    ticketRepository.queue = []
    // @ts-ignore
    ticketRepository.idCounter = 1
    ticketData = {
      subject: 'Teste',
      description: 'Descrição do ticket',
    }
  })

  test('create adiciona ticket e retorna objeto completo', async () => {
    const ticket = await ticketRepository.create(ticketData)
    expect(ticket.id).toBeDefined()
    expect(ticket.number).toBe(1)
    expect(ticket.status).toBe('queued')
    expect(ticket.subject).toBe(ticketData.subject)
    expect(ticketRepository.queue).toContain(ticket.id)
  })

  test('getById retorna ticket existente ou null', async () => {
    const ticket = await ticketRepository.create(ticketData)
    const found = await ticketRepository.getById(ticket.id)
    expect(found).toEqual(ticket)
    const notFound = await ticketRepository.getById('inexistente')
    expect(notFound).toBeNull()
  })

  test('update altera dados do ticket', async () => {
    const ticket = await ticketRepository.create(ticketData)
    const updated = await ticketRepository.update(ticket.id, {
      subject: 'Novo assunto',
    })
    expect(updated?.subject).toBe('Novo assunto')
    const notFound = await ticketRepository.update('inexistente', {
      subject: 'X',
    })
    expect(notFound).toBeNull()
  })

  test('list retorna todos os tickets', async () => {
    await ticketRepository.create(ticketData)
    await ticketRepository.create({ subject: 'Outro', description: 'Desc' })
    const list = await ticketRepository.list()
    expect(list.length).toBe(2)
  })

  test('listQueue retorna tickets na ordem da fila', async () => {
    const t1 = await ticketRepository.create(ticketData)
    const t2 = await ticketRepository.create({
      subject: 'Outro',
      description: 'Desc',
    })
    const queue = await ticketRepository.listQueue()
    expect(queue[0].id).toBe(t1.id)
    expect(queue[1].id).toBe(t2.id)
  })

  test('popNext remove e retorna o próximo da fila', async () => {
    const t1 = await ticketRepository.create(ticketData)
    const t2 = await ticketRepository.create({
      subject: 'Outro',
      description: 'Desc',
    })
    const next = await ticketRepository.popNext()
    expect(next?.id).toBe(t1.id)
    expect(ticketRepository.queue).not.toContain(t1.id)
  })

  test('returnToQueue devolve ticket ao início da fila', async () => {
    const t1 = await ticketRepository.create(ticketData)
    await ticketRepository.popNext()
    await ticketRepository.returnToQueue(t1.id)
    expect(ticketRepository.queue[0]).toBe(t1.id)
  })

  test('unassignFromAgent desatribui tickets e devolve à fila', async () => {
    const t1 = await ticketRepository.create(ticketData)
    await ticketRepository.update(t1.id, { agentId: 'A1' })
    const freed = await ticketRepository.unassignFromAgent('A1')
    expect(freed).toContain(t1.id)
    const ticket = await ticketRepository.getById(t1.id)
    expect(ticket?.agentId).toBeNull()
    expect(ticketRepository.queue[0]).toBe(t1.id)
  })

  test('getUnassigned retorna apenas tickets sem agente', async () => {
    const t1 = await ticketRepository.create(ticketData)
    const t2 = await ticketRepository.create({
      subject: 'Outro',
      description: 'Desc',
    })
    await ticketRepository.update(t2.id, { agentId: 'A2' })
    const unassigned = await ticketRepository.getUnassigned()
    expect(unassigned.map((t) => t.id)).toContain(t1.id)
    expect(unassigned.map((t) => t.id)).not.toContain(t2.id)
  })
})
