import { z } from 'zod'

export const CreateTeamSchema = z.object({
  name: z.string().min(1),
})

export const AddAgentSchema = z.object({
  name: z.string(),
  capacity: z.number().min(1),
})

export type CreateTeamDTO = z.infer<typeof CreateTeamSchema>
export type AddAgentDTO = z.infer<typeof AddAgentSchema>
