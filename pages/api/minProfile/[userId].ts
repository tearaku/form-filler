import type { NextApiRequest, NextApiResponse } from 'next'
import { Session, unstable_getServerSession } from 'next-auth'
import { MinimalProfileData } from '../../../components/profile/user-profile-type'
import { RESOURCE, MINPROFILE_WHITELIST, userHasEditRights } from '../../../utils/auth-check'
import prisma from '../../../utils/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { MinProfileRes } from '../../../types/resources'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).send({ message: "Invalid request" })
    return
  }

  // Frontend only uses name for now
  if (req.method == "GET") {
    const userId = parseInt(req.query.userId as string)
    const minUserProfile: object | null = await prisma.minimalProfile.findUnique({
      where: {
        userId: userId,
      },
      select: {
        name: true,
      }
    })
    if (!minUserProfile) {
      res.status(404).send({ message: "Minimal profile with given user ID is not found." })
      return
    }
    res.status(200).send(minUserProfile)
    return
  }

  // POST request
  if (req.method == "POST") {
    const reqMethod = req.body.method
    switch (reqMethod) {
      case "GET":
        return await getMProfile(session, req, res)
      case "UPDATE":
        return await updateMProfile(session, req, res)
    }
  }

  // Invalid request method
  res.status(405).send({ message: "Request not allowed." })
}

async function getMProfile(session: Session, req: NextApiRequest, res: NextApiResponse) {
  const userId = parseInt(req.query.userId as string)
  // Checking if requested fields are publically visible, if not, requires
  // requesting entity to have editting rights
  const seekMinProfile: MinProfileRes = req.body.reqResource
  const reqEventId: number | undefined = req.body.eventId
  const isPublicData = Object.keys(seekMinProfile).every(k => {
    if (!(k in MINPROFILE_WHITELIST)) {
      return false
    }
    return true
  })
  if (!isPublicData) {
    // "Edit rights" (more like view access) here includes host / mentor of
    // expeditions they joined
    const validReq = await userHasEditRights({
      resource: RESOURCE.MinProfile,
      payload: {
        userId: session.user.id,
        targetUserId: userId,
        eventId: reqEventId,
      }
    })
    if (!validReq) {
      res.status(403).send({ message: "Invalid request" })
      return
    }
  }

  const minUserProfile: object | null = await prisma.minimalProfile.findUnique({
    where: {
      userId: userId,
    },
    select: {
      name: seekMinProfile.Name === true,
      phoneNumber: seekMinProfile.PhoneNumber === true,
      mobileNumber: seekMinProfile.MobileNumber === true,
      userId: seekMinProfile.UserId === true,
    }
  })
  if (!minUserProfile) {
    res.status(404).send({ message: "Minimal profile with given user ID is not found." })
    return
  }
  res.status(200).send({ data: minUserProfile, message: "Minimal profile fetched." })
}

async function updateMProfile(session: Session, req: NextApiRequest, res: NextApiResponse) {
  const userId = parseInt(req.query.userId as string)
  const validReq = await userHasEditRights({
    resource: RESOURCE.MinProfile,
    payload: {
      userId: session.user.id,
    }
  })
  if (!validReq) {
    res.status(403).send({ message: "Invalid request" })
    return
  }

  const formData: MinimalProfileData = req.body.formData
  await prisma.minimalProfile.upsert({
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
  }).then(minProfile => {
    res.status(200).send({ data: minProfile, message: "Updating / creating min profile success!" })
  }).catch(err => {
    console.log(err)
    res.status(500).send({ message: "User with given ID is not found." })
  })
}
