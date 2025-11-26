export interface Ticket {
  id: string
  number: number // sequential queue number
  subject: string
  description: string
  teamId?: string
  agentId?: string | null
  status: 'queued' | 'assigned' | 'closed'
  createdAt: Date
}
