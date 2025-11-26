export interface Team {
  id: string
  type: 'card' | 'loan' | 'other'
  name: string
  agents: string[] // store agent IDs
  createdAt: Date
}
