import { z } from 'zod'

export const CreateAgentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  maxTickets: z.number().min(1, 'maxTickets must be at least 1'),
})

export type CreateAgentDTO = z.infer<typeof CreateAgentSchema>
