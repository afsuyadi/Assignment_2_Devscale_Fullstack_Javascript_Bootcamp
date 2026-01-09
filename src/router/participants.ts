import { Hono } from "hono";
import { prisma } from "../utils/prisma.js";
import { zValidator } from "@hono/zod-validator";
import { createParticipantsValidation, updateParticipantsValidation } from "../validation/participant-validation.js";


export const participantsRoute = new Hono ()
    .get("/", (c) => {
    return c.json({ events: []})
})
    .get("/:id", (c) => {
    const id = c.req.param('id')
    return c.json({ event : id})
})
    .post("/", zValidator("json", createParticipantsValidation), async (c) => {
        const body = await c.req.json();
        const newParticipant = await prisma.participant.create({
            data : {
                name : body.name,
                email : body.email,
                eventId : body.eventId,
            },
        });
        return c.json({ participant : newParticipant});
    })
    .patch("/:id", zValidator("json", updateParticipantsValidation), async (c) => {
        const id = c.req.param("id");
        const input = c.req.valid("json");
        const existingRecord = await prisma.participant.findUnique({ where: { id } });
        if (!existingRecord) return c.json({ pesan: "This participant is not founded." }, 404);
        
        const updateDate = await prisma.participant.update({
            where : {id},
            data : input, 
            include : {event : true}
        })

        return c.json({ data : updateDate});
    })
    .delete("/:id", (c) => {
        const id = c.req.param("id");
        return c.json({ event : id})
    })