import { EventRole } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import prisma from '../../../../utils/prisma'
import { authOptions } from '../../auth/[...nextauth]'
import { createHmac } from "crypto"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).send({ message: "Invalid request" })
    return
  }
  // POST request, update
  if (req.method == "POST") {
    const { userId, role, reqToken } = req.body
    // Disallow joining as Host (as this input is taken from URL)
    if (!Object.keys(EventRole).some(value => (value == role) && (value != EventRole.Host))) {
      res.status(405).json({ message: "Invalid role." })
      return
    }
    const eventId = parseInt(req.query.eventId as string)

    // Check validity of request token (HMAC digest)
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    const hmac = createHmac('sha512', 'a very public thing')
    hmac.update(role)
    hmac.update(event.inviteToken)
    const digest = hmac.digest('hex')
    if (!event || digest != reqToken) {
      res.status(405).send({ message: "Invalid request." })
      return
    }
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
