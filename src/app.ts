import express from 'express'
import teamRoutes from './routes/teams.routes'
import ticketRoutes from './routes/tickets.routes'
import agentRoutes from './routes/agents.routes'
import { TicketListeners } from './modules/ticket/ticket.listeners'
import { eventBus } from './events/eventBus'
import { ticketService } from './modules/ticket/ticket.service'
import { agentService } from './modules/agent/agent.service'
import { teamService } from './modules/team/team.service'
import { AgentListeners } from './modules/agent/agent.listeners'

new AgentListeners(eventBus, agentService).register()
new TicketListeners(
  eventBus,
  ticketService,
  agentService,
  teamService,
).register()

const app = express()
app.use(express.json())

app.use('/teams', teamRoutes)
app.use('/tickets', ticketRoutes)
app.use('/agents', agentRoutes)

export default app
