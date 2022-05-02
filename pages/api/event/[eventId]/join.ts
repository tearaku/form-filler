import { EventRole } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // POST request, update
  // TODO?: block updating as host-role?
  if (req.method == "POST") {
    const { userId, role } = req.body
    console.log(req.body)
    if (!Object.keys(EventRole).some(value => value == role)) {
      res.status(500).send({ message: "Invalid role." })
      return
    }
    const eventId = parseInt(req.query.eventId as string)
    const attendance = await prisma.attendance.create({
      data: {
        user: {
          connect: {
            id: userId,
          }
        },
        event: {
          connect: {
            id: eventId,
          }
        },
        role: EventRole[role],
      }
    })
    if (!attendance) {
      res.status(500).send({ message: "Creating attendance failed." })
      return
    }
    res.status(200).send({ message: "Join event: success!" })
    return
  }

  // Invalid request method
  res.status(405).send({ message: "Request not allowed." })
}