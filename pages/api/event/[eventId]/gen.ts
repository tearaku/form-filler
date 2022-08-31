import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import stream from 'stream'
import { promisify } from 'util'
import { RESOURCE, userHasEditRights } from '../../../../utils/auth-check'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    // Part of authority check is handled in backend (avoid hitting db twice for the same check la)
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
      res.status(401).send({ message: "Invalid request" })
      return
    }
    // TODO: Check for edit authority too.....
    const eventId = req.query.eventId as string
    const validReq = await userHasEditRights({
      resource: RESOURCE.Event,
      payload: { id: parseInt(eventId), userId: session.user.id },
    })
    if (!validReq) {
      res.status(403).send({ message: "Invalid request " })
      return
    }
    const response = await fetch(`${process.env.BACKEND_URL}/event/${eventId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session.user.id,
        secret: process.env.BACKEND_SECRET as string,
      })
    })
    if (!response.ok) {
      res.status(500).send({ message: "Error in fetching data from server." })
      return
    }
    res.writeHead(200, {
      "Content-Type": "application/zip",
    })
    const pipeline = promisify(stream.pipeline)
    // @ts-ignore
    await pipeline(response.body, res)
    return
  }

  res.status(405).send({ message: "Request not allowed." })
}
