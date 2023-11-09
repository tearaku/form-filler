import { unstable_getServerSession } from 'next-auth'

import type { NextApiRequest, NextApiResponse } from 'next'
import { EquipData } from '../../../../components/event/event-type'

import prisma from '../../../../utils/prisma'
import { RESOURCE, userHasEditRights } from '../../../../utils/auth-check'
import { authOptions } from '../../auth/[...nextauth]'

type ImportEquipPayload = {
  equip?: EquipData[],
  techEquip?: EquipData[],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).send({ message: "Invalid request" })
    return
  }

  // POST request, update only
  if (req.method == "POST") {
    const user_id = req.body.userId;
    const event_id = parseInt(req.body.eventId as string);
    const validReq = await userHasEditRights({
      resource: RESOURCE.Event,
      payload: {
        id: event_id,
        userId: user_id,
      }
    });
    if (!validReq) {
      res.status(403).send({ message: "Invalid request" });
      return;
    }

    const { equip, techEquip: tech_equip }: ImportEquipPayload = req.body.formData;
    const event_data = await prisma.event.findUnique({ where: { id: event_id } });
    const to_update: any = {};

    if (equip?.length > 0) {
      to_update.equipList = [...event_data.equipList];
      to_update.equipDes = [...event_data.equipDes];
      equip?.forEach(v => {
        const base_e_id = event_data.equipList.indexOf(v.name);
        if (base_e_id >= 0) {
          to_update.equipDes[base_e_id] = v.des;
        } else {
          to_update.equipList.push(v.name);
          to_update.equipDes.push(v.des);
        }
      });
    }
    if (tech_equip?.length > 0) {
      to_update.techEquipList = [...event_data.techEquipList];
      to_update.techEquipDes = [...event_data.techEquipDes];
      tech_equip?.forEach(v => {
        const base_e_id = event_data.techEquipList.indexOf(v.name);
        if (base_e_id >= 0) {
          to_update.techEquipDes[base_e_id] = v.des;
        } else {
          to_update.techEquipList.push(v.name);
          to_update.techEquipDes.push(v.des);
        }
      });
    }

    await prisma.event.update({
      where: {
        id: event_id,
      },
      data: to_update,
    }).then(() => {
      res.status(200).send({ message: "Event equipment info import: updated!" });
    }).catch(err => {
      console.log(err);
      res.status(500).send({ message: "Updating imported event equipment info: failed." });
    });
    return;
  }

  // Invalid request method
  res.status(405).send({ message: "Request not allowed." });
}
