import request from 'supertest'
import app from '@/app'
import { ticketService } from '@/modules/ticket/ticket.service'

jest.mock('@/modules/ticket/ticket.service', () => ({
  ticketService: {
    listQueue: jest.fn(),
    create: jest.fn(),
    returnToQueue: jest.fn(),
  },
}))

describe('Ticket Routes', () => {
  beforeEach(() => jest.clearAllMocks())

  test('GET /tickets/queue retorna lista de tickets', async () => {
    ;(ticketService.listQueue as jest.Mock).mockResolvedValue([{ id: 'T1' }])
    const res = await request(app).get('/tickets/queue')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].id).toBe('T1')
  })

  test('POST /tickets cria um ticket', async () => {
    ;(ticketService.create as jest.Mock).mockResolvedValue({
      id: 'T2',
      subject: 'Teste',
    })
    const res = await request(app)
      .post('/tickets')
      .send({ subject: 'Teste', description: 'Ticket description' })

    expect(res.status).toBe(201)
    expect(res.body.id).toBe('T2')
  })

  test('POST /tickets retorna 400 com dados inválidos', async () => {
    const res = await request(app)
      .post('/tickets')
      .send({ subject: '', description: '' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })

  test('POST /tickets/:id/close retorna ticket reprocessado', async () => {
    ;(ticketService.returnToQueue as jest.Mock).mockResolvedValue({ id: 'T3' })
    const res = await request(app).post('/tickets/T3/close').send()
    expect(res.status).toBe(200)
    expect(res.body.id).toBe('T3')
  })

  test('POST /tickets/:id/close retorna 400 se erro', async () => {
    ;(ticketService.returnToQueue as jest.Mock).mockImplementation(() => {
      throw new Error('Falha')
    })
    const res = await request(app).post('/tickets/T99/close').send()
    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })
})
