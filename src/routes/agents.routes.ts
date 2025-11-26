import { Router } from 'express'
import { CreateAgentSchema } from '@/modules/agent/agent.schema'
import { AgentRepository } from '@/modules/agent/agent.repository'
import { AgentService } from '@/modules/agent/agent.service'
import { eventBus } from '@/events/eventBus'
import { EVENTS } from '@/events/events'

const router = Router()
const repo = new AgentRepository()
const service = new AgentService(repo)

// Create agent
router.post('/', async (req, res) => {
  try {
    const data = CreateAgentSchema.parse(req.body)
    const agent = await service.createAgent(data)
    // notify other modules
    eventBus.emit(EVENTS.AGENT_UPDATED, { action: 'added', agent })
    res.status(201).json(agent)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// List agents
router.get('/', async (_req, res) => {
  const agents = await service.listAgents()
  res.json(agents)
})

// Remove agent
router.delete('/:id', async (req, res) => {
  const removed = await service.removeAgent(req.params.id)
  if (!removed) return res.status(404).json({ error: 'agent not found' })
  eventBus.emit(EVENTS.AGENT_UPDATED, { action: 'removed', agent: removed })
  res.json(removed)
})

// Assign ticket to agent
router.post('/:id/assign/:ticketId', async (req, res) => {
  try {
    const agent = await service.assignTicketToAgent(
      req.params.id,
      req.params.ticketId,
    )
    if (!agent) return res.status(404).json({ error: 'agent not found' })
    res.json(agent)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

// Release ticket from agent (optional ticketId)
router.post('/:id/release', async (req, res) => {
  const { ticketId } = req.body
  const t = await service.releaseTicketFromAgent(req.params.id, ticketId)
  if (t === null) return res.status(404).json({ error: 'agent not found' })
  res.json({ releasedTicketId: t })
})

export default router
