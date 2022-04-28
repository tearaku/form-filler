import type { NextApiRequest, NextApiResponse } from 'next'

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
      const attendance = await prisma.attendance.delete({
        where: {
          eventId_userId: {eventId, userId},
        }
      })
      if (!attendance) {
        res.status(500).send({message: "Error: Attendance does not exist."})
        return
      }
      res.send({message: "User kick: successful!"})
      return
    } else {
      const attendance = await prisma.attendance.update({
        where: {
          eventId_userId: { eventId, userId },
        },
        data: {
          ...req.body.formData,
        }
      })
      if (!attendance) {
        res.status(500).send({ message: "User or event not found." })
        return
      }
      res.status(200).send({ message: "Updating attendance: success!" })
      return
    }
  }

  res.status(405).send({ message: "Request not allowed." })
}