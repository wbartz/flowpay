import { z } from 'zod'

export const CreateTicketSchema = z.object({
  subject: z.string().min(3),
  description: z.string().min(10),
})

export type CreateTicketDTO = z.infer<typeof CreateTicketSchema>
