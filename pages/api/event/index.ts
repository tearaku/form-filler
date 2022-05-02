import { nanoid } from 'nanoid'
import type { NextApiRequest, NextApiResponse } from 'next'
import { EventData } from '../../../components/event/event-type'
import prisma from '../../../utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // POST request, event creation only
  if (req.method == "POST") {
    const userId = req.body.userId
    const formData: EventData = req.body.formData
    const { equip, equip_add, techEquip, techEquip_add, ...eventData } = formData
    const event = await prisma.event.create({
      data: {
        ...eventData,
        beginDate: new Date(eventData.beginDate),
        endDate: new Date(eventData.endDate),
        equipList: [...equip.map(value => value.name), ...equip_add.map(value => value.name)],
        equipDes: [...equip.map(value => value.des), ...equip_add.map(value => value.des)],
        techEquipList: [...techEquip.map(value => value.name), ...techEquip_add.map(value => value.name)],
        techEquipDes: [...techEquip.map(value => value.des), ...techEquip_add.map(value => value.des)],
        inviteToken: nanoid(),
        attendants: {
          create: {
            role: 'Host',
            jobs: '領隊',
            user: {
              connect: { id: userId }
            },
          },
        }
      }
    })
    if (!event) {
      res.status(500).send({ message: "Event creation failed." })
      return
    }
    res.status(200).send({ message: "Event created!" })
    return
  }

  // Invalid request method
  res.status(405).send({ message: "Request not allowed." })
}