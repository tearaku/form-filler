import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET request, queried by name
  if (req.method == "GET") {
    const name = req.query.name as string
    const minProfileList = await prisma.minimalProfile.findMany({
      where: {
        name: name,
      }
    })
    const profileList = await Promise.all(minProfileList.map(async (value) => {
      return await prisma.profile.findUnique({
        where: {
          userId: value.userId,
        }
      })
    }))
    console.log(profileList)
    res.status(200).json({
      minProfileList: minProfileList,
      profileList: profileList,
      message: "Querying profiles by name: successful!"
    })
    return
  }

  res.status(405).json({ message: "Request not allowed." })
}