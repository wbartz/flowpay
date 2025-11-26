import { z } from 'zod'

export const CreateAgentSchema = z.object({
  name: z.string().min(1),
  teamId: z.string().uuid().optional(),
  capacity: z.number().int().min(1).max(10).optional(),
})

export type CreateAgentDTO = z.infer<typeof CreateAgentSchema>
