import { CreateTeamSchema } from '@/modules/team/team.schema'
import { teamService } from '@/modules/team/team.service'
import { Router } from 'express'
import { z } from 'zod'

const router = Router()

router.get('/', async (_req, res) => {
  const teams = await teamService.list()
  res.json(teams)
})

router.post('/', async (req, res) => {
  try {
    const data = CreateTeamSchema.parse(req.body)
    const team = await teamService.create(data)
    res.status(201).json(team)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/:id/agents', async (req, res) => {
  try {
    const schema = z.object({ agentId: z.string().min(1) })
    const data = schema.parse(req.body)
    const team = await teamService.addAgent(req.params.id, data.agentId)
    res.json(team)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const data = CreateTeamSchema.parse(req.body)
    const updated = await teamService.update(req.params.id, data)
    if (!updated) return res.status(404).json({ error: 'team not found' })
    res.json(updated)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id/agents/:agentId', async (req, res) => {
  try {
    const team = await teamService.removeAgent(
      req.params.id,
      req.params.agentId,
    )
    res.status(204).json(team)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router
