import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // POST request
  if (req.method == "POST") {
    const userId = parseInt(req.query.userId as string)
    const eventId = parseInt(req.query.eventId as string)
    // Kick or update request
    const toKick = req.body.formData.toRemove
    if (toKick) {
      await prisma.attendance.delete({
        where: {
          eventId_userId: {eventId, userId},
        }
      }).then(() => {
        res.send({message: "User kick: successful!"})
      }).catch(err => {
        console.log(err)
        res.status(500).send({message: "Error: Attendance does not exist."})
      })
      return
    } else {
      const attendance = await prisma.attendance.update({
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