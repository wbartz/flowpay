export interface Agent {
  id: string
  name: string
  teamId?: string
  capacity: number // máximo de tickets simultâneos
  assignedTickets: string[] // lista de ticket ids
  createdAt: Date
}
