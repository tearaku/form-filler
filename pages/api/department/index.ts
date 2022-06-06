import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "PUT") {
    console.log(req.body)
    const userId = parseInt(req.body.userId as string)
    const description = req.body.description as string
    try {
      await prisma.department.create({
        data: {
          user: { connect: { id: userId } },
          description: description
        }
      })
    } catch (e) {
      console.log(e)
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code == 'P2002') {
          res.status(500).json({
            message: `Unique constraint failed:
              either the user already holds said committe position,
              or said committee position already exists.
              In the latter case, append numbers if you wish to have
              multiple members of the same committee position (ex: '活動部長2')`
          })
          return
        } else if (e.code == 'P2018') {
          res.status(500).json({ message: "User to appoint committee memership may not exist." })
          return
        }
      }
      res.status(500).json({ message: "Something ain't right, call the admin xdd." })
      return
    }

    res.status(200).json({ message: "Create committee membership: successful." })
    return
  }

  if (req.method == "DELETE") {
    const userId = parseInt(req.body.userId as string)
    const description = req.body.description as string
    const deptInfo = await prisma.department.delete({
      where: {
        userId_description: { userId, description },
      }
    })

    if (!deptInfo) {
      res.status(500).json({ message: "Error in deleting the given committee member." })
      return
    }

    res.status(200).json({ message: "Removal of committee member: successful!" })
    return
  }

  res.status(405).json({ message: "Invalid request." })
}