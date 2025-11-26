import { Router } from 'express'
import { CreateAgentSchema } from '@/modules/agent/agent.schema'
import { agentService } from '@/modules/agent/agent.service'
import { eventBus } from '@/events/eventBus'
import { EVENTS } from '@/events/events'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const data = CreateAgentSchema.parse(req.body)
    const agent = await agentService.create(data)
    eventBus.publish(EVENTS.AGENT_UPDATED, { action: 'added', agent })
    res.status(201).json(agent)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/', async (_req, res) => {
  const agents = await agentService.list()
  res.json(agents)
})

router.put('/:id', async (req, res) => {
  try {
    const data = CreateAgentSchema.parse(req.body)
    const updated = await agentService.update(req.params.id, data)
    if (!updated) return res.status(404).json({ error: 'agent not found' })
    eventBus.publish(EVENTS.AGENT_UPDATED, {
      action: 'updated',
      agent: updated,
    })
    res.json(updated)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const removed = await agentService.delete(req.params.id)
    if (!removed) return res.status(404).json({ error: 'agent not found' })
    eventBus.publish(EVENTS.AGENT_UPDATED, {
      action: 'removed',
      agent: removed,
    })
    res.json(removed)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router
