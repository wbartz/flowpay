export interface Agent {
  id: string
  name: string
  teamId?: string | null
  assignedTickets: string[]
  maxTickets: number
  createdAt: Date
}
