import { NextApiRequest, NextApiResponse } from 'next'
import { Session, unstable_getServerSession } from 'next-auth'
import { RESOURCE, userHasEditRights } from '../../../../utils/auth-check'
import { authOptions } from '../../auth/[...nextauth]'
import prisma from '../../../../utils/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).send({ message: "Invalid request" })
    return
  }

  // Query by name matches, only whitelisted resources are returned
  // But endpoint is still restricted to admins
  if (req.method == "GET") {
    const name = req.query.name as string

    const validReq = await userHasEditRights({
      resource: RESOURCE.Department,
      payload: {
        userId: session.user.id,
      }
    })
    if (!validReq) {
      res.status(403).send({ message: "Invalid request" })
      return
    }

    const minProfileList = await prisma.minimalProfile.findMany({
      where: {
        name: name,
      },
      select: {
        userId: true,
        name: true,
      }
    })
    const profileList = await Promise.all(minProfileList.map(async (value) => {
      return await prisma.profile.findUnique({
        where: {
          userId: value.userId,
        },
        select: {
          engName: true,
          isMale: true,
          isStudent: true,
          majorYear: true,
        }
      })
    }))
    res.status(200).json({
      minProfileList: minProfileList,
      profileList: profileList,
      message: "Querying profiles by name: successful!"
    })
    return
  }

  res.status(405).json({ message: "Request not allowed." })
}
