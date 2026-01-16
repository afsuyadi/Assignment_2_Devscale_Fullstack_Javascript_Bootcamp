import z from "zod";

export const createParticipantsValidation = z.object({
    name : z.string().min(3),
    email : z.string().email(),
    eventId : z.string(),
})

export const updateParticipantsValidation = z.object({
    name : z.string().min(3).optional(),
    email : z.string().email().optional(),
    eventId : z.string().min(1).optional(),
})