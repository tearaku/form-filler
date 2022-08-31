import { nanoid } from "nanoid"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    console.log(nanoid())
    res.status(200)
    return
  }
}
