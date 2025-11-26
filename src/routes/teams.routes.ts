import { eventBus } from '@/events/eventBus'
import { registerTeamListeners } from '@/modules/team/team.listeners'
import { TeamRepository } from '@/modules/team/team.repository'
import { TeamService } from '@/modules/team/team.service'
import { Router } from 'express'
import { z } from 'zod'

const router = Router()
const teamRepo = new TeamRepository()
const teamService = new TeamService(teamRepo)

registerTeamListeners(teamService, eventBus)

router.get('/', async (_req, res) => {
  res.json(await teamService.listTeams())
})

router.post('/', async (req, res) => {
  const schema = z.object({ name: z.string().min(1) })
  const data = schema.parse(req.body)
  const team = await teamService.createTeam(data.name)
  res.status(201).json(team)
})

router.post('/:id/agents', async (req, res) => {
  const schema = z.object({ name: z.string(), capacity: z.number().min(1) })
  const data = schema.parse(req.body)
  const team = await teamService.addAgent(req.params.id, data)
  res.json(team)
})

router.delete('/:id/agents/:agentId', async (req, res) => {
  const team = await teamService.removeAgent(req.params.id, req.params.agentId)
  res.json(team)
})

export default router
