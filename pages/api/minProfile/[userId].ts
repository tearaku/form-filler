import type { NextApiRequest, NextApiResponse } from 'next'
import { MinimalProfileData } from '../../../components/profile/user-profile-type'
import prisma from '../../../utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // POST request
  if (req.method == "POST") {
    const userId = parseInt(req.query.userId as string)
    const formData: MinimalProfileData = req.body.formData
    const minUserProfile = await prisma.minimalProfile.upsert({
      where: {
        userId: userId,
      },
      create: {
        user: {
          connect: { id: userId },
        },
        name: formData.name,
        mobileNumber: formData.mobileNumber,
        phoneNumber: formData.phoneNumber,
      },
      update: {
        name: formData.name,
        mobileNumber: formData.mobileNumber,
        phoneNumber: formData.phoneNumber,
      }
    })
    if (!minUserProfile) {
      res.status(500).send({ message: "User with given ID is not found." })
      return
    }
    res.status(200).send(minUserProfile)
    return
  }

  if (req.method == "GET") {
    const userId = parseInt(req.query.userId as string)
    const minUserProfile = await prisma.minimalProfile.findUnique({
      where: {
        userId: userId,
      },
    })
    if (!minUserProfile) {
      res.status(500).send({ message: "Minimal profile with given user ID is not found." })
      return
    }
    res.status(200).send(minUserProfile)
    return
  }

  // Invalid request method
  res.status(405).send({ message: "Request not allowed." })
}