export interface Ticket {
  id: string
  number: number // sequential queue number
  subject: string
  description: string
  teamId?: string
  status: 'queued' | 'assigned' | 'closed'
  createdAt: Date
}
