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
    if (!Object.keys(EventRole).some(value => value == role)) {
      res.status(500).json({ message: "Invalid role." })
      return
    }
    const eventId = parseInt(req.query.eventId as string)
    await prisma.attendance.create({
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
    }).then(() => {
      res.status(200).send({ message: "Join event: success!" })
    }).catch(err => {
      console.log(err)
      res.status(500).send({ message: "Creating attendance failed." })
    })
    return
  }

  // Invalid request method
  res.status(405).json({ message: "Request not allowed." })
}
