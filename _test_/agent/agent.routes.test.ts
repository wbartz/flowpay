import request from 'supertest'
import app from '@/app'
import { agentRepository } from '@/modules/agent/agent.repository'

jest.mock('@/modules/agent/agent.repository', () => ({
  agentRepository: {
    create: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
  },
}))

describe('Agent Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(agentRepository.create as jest.Mock).mockResolvedValue({
      id: 'A1',
      name: 'John',
    })
    ;(agentRepository.update as jest.Mock).mockResolvedValue({
      id: 'A1',
      name: 'Jane',
      maxTickets: 5,
    })
    ;(agentRepository.getById as jest.Mock).mockResolvedValue({
      id: 'A1',
      name: 'John',
    })
  })

  test('POST /agents cria agente', async () => {
    const res = await request(app)
      .post('/agents')
      .send({ name: 'John', maxTickets: 3 })
    expect(res.status).toBe(201)
    expect(res.body.id).toBe('A1')
  })

  test('GET /agents retorna lista', async () => {
    ;(agentRepository.list as jest.Mock).mockResolvedValue([{ id: 'A1' }])
    const res = await request(app).get('/agents')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
  })

  test('PUT /agents/:id atualiza agente', async () => {
    const res = await request(app)
      .put('/agents/A1')
      .send({ name: 'Jane', maxTickets: 5 })
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Jane')
    expect(res.body.maxTickets).toBe(5)
  })

  test('PUT /agents/:id retorna 404 se agente não existe', async () => {
    ;(agentRepository.update as jest.Mock).mockResolvedValue(null)
    const res = await request(app)
      .put('/agents/NAOEXISTE')
      .send({ name: 'Jane', maxTickets: 5 })
    expect(res.status).toBe(404)
  })

  test('DELETE /agents/:id remove agente', async () => {
    ;(agentRepository.delete as jest.Mock).mockResolvedValue(true)
    const res = await request(app).delete('/agents/A1')
    expect(res.status).toBe(204)
  })

  test('DELETE /agents/:id retorna 404 se agente não existe', async () => {
    ;(agentRepository.delete as jest.Mock).mockResolvedValue(false)
    const res = await request(app).delete('/agents/NAOEXISTE')
    expect(res.status).toBe(404)
  })

  test('GET /agents/:id retorna agente por id', async () => {
    const res = await request(app).get('/agents/A1')
    expect(res.status).toBe(200)
    expect(res.body.id).toBe('A1')
  })

  test('POST /agents retorna 400 com dados inválidos', async () => {
    const res = await request(app)
      .post('/agents')
      .send({ name: '', maxTickets: -1 })
    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })
})
