import { nanoid } from 'nanoid'
import type { NextApiRequest, NextApiResponse } from 'next'
import { EventData } from '../../../components/event/event-type'
import prisma from '../../../utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    // 1. Get valid listings (past events aren't fetched)
    const eventList = await prisma.event.findMany({
      where: {
        endDate: {
          gte: new Date(),
        },
      },
      include: {
        attendants: true,
      },
      orderBy: {
        beginDate: 'asc',
      }
    })
    const parsedEventList = eventList.map(event => {
      return ({
        ...event,
        beginDate: event.beginDate.toISOString(),
        endDate: event.endDate.toISOString(),
      })
    })
    res.status(200).send({ data: parsedEventList, message: "Event listing fetched." })
    return
  }
  // POST request, event creation only, updates are done via another route
  if (req.method == "POST") {
    const userId = req.body.userId
    const formData: EventData = req.body.formData
    const { equip, equip_add, techEquip, techEquip_add, ...eventData } = formData
    await prisma.event.create({
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
    }).then(() => {
      res.status(200).send({ message: "Event created!" })
    }).catch(err => {
      console.log(err)
      res.status(500).send({ message: "Event creation failed." })
    })
    return
  }

  // Invalid request method
  res.status(405).send({ message: "Request not allowed." })
}
