import request from 'supertest'
import app from '@/app'
import { teamRepository } from '@/modules/team/team.repository'
import { agentRepository } from '@/modules/agent/agent.repository'

jest.mock('@/modules/team/team.repository', () => ({
  teamRepository: {
    create: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
  },
}))

jest.mock('@/modules/agent/agent.repository', () => ({
  agentRepository: {
    getById: jest.fn(),
    update: jest.fn(),
  },
}))

describe('Team Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(teamRepository.getById as jest.Mock).mockResolvedValue({
      id: 'T1',
      name: 'Team Updated',
      type: 'loan',
      agents: [],
    })
    ;(agentRepository.getById as jest.Mock).mockResolvedValue({
      id: 'A3',
      name: 'Agent 3',
    })
    ;(agentRepository.update as jest.Mock).mockResolvedValue({
      id: 'A3',
      name: 'Agent 3',
    })
    ;(teamRepository.update as jest.Mock).mockResolvedValue({
      id: 'T1',
      name: 'Team Updated',
      type: 'loan',
      agents: [],
    })
    ;(teamRepository.create as jest.Mock).mockResolvedValue({
      id: 'T1',
      name: 'Team Updated',
      type: 'loan',
      agents: [],
    })
  })

  test('POST /teams cria um time', async () => {
    const res = await request(app)
      .post('/teams')
      .send({ name: 'Team A', type: 'card' })
    expect(res.status).toBe(201)
    expect(res.body.id).toBe('T1')
  })

  test('GET /teams retorna lista', async () => {
    ;(teamRepository.list as jest.Mock).mockResolvedValue([{ id: 'T1' }])
    const res = await request(app).get('/teams')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
  })

  test('PUT /teams/:id atualiza um time', async () => {
    const res = await request(app)
      .put('/teams/T1')
      .send({ name: 'Team Updated', type: 'loan' })
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Team Updated')
    expect(res.body.type).toBe('loan')
  })

  test('PUT /teams/:id retorna 404 quando time não existe', async () => {
    ;(teamRepository.update as jest.Mock).mockResolvedValue(null)

    const res = await request(app)
      .put('/teams/NONEXISTENT')
      .send({ name: 'Team Updated', type: 'card' })
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('team not found')
  })

  test('PUT /teams/:id retorna 400 com dados inválidos', async () => {
    const res = await request(app)
      .put('/teams/T1')
      .send({ name: '', type: 'invalid' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })

  test('POST /teams/:id/agents adiciona agente a um time', async () => {
    ;(teamRepository.update as jest.Mock).mockResolvedValue({
      id: 'A3',
      name: 'Agent 3',
      agents: ['A1', 'A2', 'A3'],
    })
    const res = await request(app)
      .post('/teams/T1/agents')
      .send({ agentId: 'A3' })

    expect(res.status).toBe(200)
    expect(res.body.agents).toContain('A3')
  })

  test('POST /teams/:id/agents retorna 400 com agentId inválido', async () => {
    const res = await request(app)
      .post('/teams/T1/agents')
      .send({ agentId: '' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })

  test('DELETE /teams/:id/agents/:agentId remove agente de um time', async () => {
    const res = await request(app).delete('/teams/T1/agents/A3')

    expect(res.status).toBe(200)
    expect(res.body.agents).not.toContain('A3')
  })
})
