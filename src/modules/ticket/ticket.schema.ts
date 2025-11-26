import { z } from 'zod'

export const CreateTicketSchema = z.object({
  subject: z.string().min(3),
})

export type CreateTicketDTO = z.infer<typeof CreateTicketSchema>
