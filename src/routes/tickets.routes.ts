import { TicketRepository } from '@/modules/ticket/ticket.repository'
import { TicketService } from '@/modules/ticket/ticket.service'
import { Router } from 'express'
import { CreateTicketSchema } from '@/modules/ticket/ticket.schema'

const router = Router()
const ticketRepo = new TicketRepository()
const ticketService = new TicketService(ticketRepo)

router.get('/', async (_req, res) => {
  res.json(await ticketService.listTickets())
})

router.post('/', async (req, res) => {
  const data = CreateTicketSchema.parse(req.body)
  const ticket = await ticketService.createTicket(data)
  res.status(201).json(ticket)
})

router.post('/:id/close', async (req, res) => {
  const ticket = await ticketService.closeTicket(req.params.id)
  res.json(ticket)
})

export default router
