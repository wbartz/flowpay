import { ticketService } from '@/modules/ticket/ticket.service'
import { Router } from 'express'
import { CreateTicketSchema } from '@/modules/ticket/ticket.schema'

const router = Router()

router.get('/queue', async (req, res) => {
  try {
    const tickets = await ticketService.listQueue()
    res.json(tickets)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const data = CreateTicketSchema.parse(req.body)
    const ticket = await ticketService.create(data)
    res.status(201).json(ticket)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/:id/close', async (req, res) => {
  try {
    const ticket = await ticketService.returnToQueue(req.params.id)
    res.json(ticket)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router
