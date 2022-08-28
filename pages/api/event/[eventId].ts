import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { EventData } from '../../../components/event/event-type'
import { RESOURCE, userHasEditRights } from '../../../utils/auth-check'
import prisma from '../../../utils/prisma'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).send({ message: "Invalid request" })
    return
  }

  if (req.method == "GET") {
    const eventId = parseInt(req.query.eventId as string)
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        attendants: true,
      },
    })
    if (!event) {
      res.status(404).send({ message: "Event with given event id not found." })
      return
    }
    res.status(200).send({ data: event, message: "Event query: success!" })
    return
  }

  // POST request, update only
  if (req.method == "POST") {
    const userId = req.body.userId
    const eventId = parseInt(req.query.eventId as string)
    const validReq = await userHasEditRights({
      resource: RESOURCE.Event,
      payload: {
        id: eventId,
        userId: userId,
      }
    })
    if (!validReq) {
      res.status(403).send({ message: "Invalid request" })
      return
    }
    const formData: EventData = req.body.formData
    const { equip, equip_add, techEquip, techEquip_add, ...eventData } = formData
    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        ...eventData,
        beginDate: new Date(eventData.beginDate),
        endDate: new Date(eventData.endDate),
        equipList: [...equip.map(value => value.name), ...equip_add.map(value => value.name)],
        equipDes: [...equip.map(value => value.des), ...equip_add.map(value => value.des)],
        techEquipList: [...techEquip.map(value => value.name), ...techEquip_add.map(value => value.name)],
        techEquipDes: [...techEquip.map(value => value.des), ...techEquip_add.map(value => value.des)],
      }
    }).then(() => {
      res.status(200).send({ message: "Event basic info: updated!" })
    }).catch(err => {
      console.log(err)
      res.status(500).send({ message: "Updating event basic info: failed." })
    })
    return
  }

  // Invalid request method
  res.status(405).send({ message: "Request not allowed." })
}
