import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET request
  if (req.method == "GET") {
    const userId = parseInt(req.query.userId as string)
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user) {
      res.status(500).send({ message: "User data not found." })
      return
    }
    res.status(200).send({ data: user, message: "User data query: success." })
    return
  }

  res.status(405).send({ message: "Request not allowed." })
}