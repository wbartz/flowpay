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
  beforeEach(() => jest.clearAllMocks())

  test('POST /agents cria agente', async () => {
    ;(agentRepository.create as jest.Mock).mockResolvedValue({
      id: 'A1',
      name: 'John',
    })
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
    expect(res.body.length).toBe(1)
  })
})
