import type { NextApiRequest, NextApiResponse } from 'next'
import { EventData } from '../../../components/event/event-type'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // POST request, update
  if (req.method == "POST") {
    const userId = req.body.userId
    const eventId = parseInt(req.query.eventId as string)
    const formData: EventData = req.body.formData
    const { equip, equip_add, techEquip, techEquip_add, ...eventData } = formData
    const event = await prisma.event.update({
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
    })
    if (!event) {
      res.status(500).send({ message: "Updating event basic info: failed." })
      return
    }
    res.status(200).send({ message: "Event basic info: updated!" })
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
      rejectOnNotFound: true,
    }).catch(err => {
      res.status(500).send({ message: "Event with given event id not found." })
      return
    })
    res.status(200).send({ data: event, message: "Event query: success!" })
    return
  }

  // Invalid request method
  res.status(405).send({ message: "Request not allowed." })
}