import express from 'express'
import teamRoutes from './routes/teams.routes'
import ticketRoutes from './routes/tickets.routes'
import agentRoutes from './routes/agents.routes'

const app = express()
app.use(express.json())

app.use('/teams', teamRoutes)
app.use('/tickets', ticketRoutes)
app.use('/agents', agentRoutes)

export default app
