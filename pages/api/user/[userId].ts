import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma'
import { unstable_getServerSession } from 'next-auth'
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

  // Fields actually used: name, image
  if (req.method == "GET") {
    const userId = parseInt(req.query.userId as string)
    const user: object | null = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        image: true,
      }
    })
    if (!user) {
      res.status(404).send({ message: "User data not found." })
      return
    }
    res.status(200).send({ data: user, message: "User data query: success." })
    return
  }

  res.status(405).send({ message: "Request not allowed." })
}
