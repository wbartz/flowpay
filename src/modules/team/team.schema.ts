import { z } from 'zod'

export const CreateTeamSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['card', 'loan', 'other']),
})

export type CreateTeamDTO = z.infer<typeof CreateTeamSchema>
