import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../utils/prisma'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]'
import { RESOURCE, userHasEditRights } from '../../../../../utils/auth-check'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).send({ message: "Invalid request" })
    return
  }

  // POST request
  if (req.method == "POST") {
    const userId = parseInt(req.query.userId as string)
    const eventId = parseInt(req.query.eventId as string)
    const validReq = await userHasEditRights({
      resource: RESOURCE.Event,
      payload: {
        id: eventId,
        userId: session.user.id,
      },
    })
    if (!validReq) {
      res.status(403).send({ message: "Invalid request" })
      return
    }
    // Kick or update request
    const toKick = req.body.formData.toRemove
    if (toKick) {
      await prisma.attendance.delete({
        where: {
          eventId_userId: { eventId, userId },
        }
      }).then(() => {
        res.send({ message: "User kick: successful!" })
      }).catch(err => {
        console.log(err)
        res.status(500).send({ message: "Error: Attendance does not exist." })
      })
      return
    } else {
      await prisma.attendance.update({
        where: {
          eventId_userId: { eventId, userId },
        },
        data: {
          ...req.body.formData,
        }
      }).then(() => {
        res.status(200).send({ message: "Updating attendance: success!" })
      }).catch(err => {
        console.log(err)
        res.status(500).send({ message: "User or event not found." })
      })
      return
    }
  }

  res.status(405).send({ message: "Request not allowed." })
}
