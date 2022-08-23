// Callback for Facebook's data deletion
import type { NextApiRequest, NextApiResponse } from 'next'

function parseSignedReq(req) {
  console.log(req)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    parseSignedReq(req)
    return
  }
  res.status(405).send({ message: "Request not allowed." })
}
