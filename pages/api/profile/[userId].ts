import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Session, unstable_getServerSession } from 'next-auth'
import { ProfileData } from '../../../components/profile/user-profile-type'
import { ProfileRes } from '../../../types/resources'
import { RESOURCE, PROFILE_WHITELIST, userHasEditRights } from '../../../utils/auth-check'
import prisma from '../../../utils/prisma'
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

  if (req.method == "POST") {
    // Parse if its updating or selective-fetching of data
    const reqMethod = req.body.method
    switch (reqMethod) {
      case "GET":
        return await getProfile(session, req, res)
      case "UPDATE":
        return await updateProfile(session, req, res)
    }
  }

  res.status(405).send({ message: "Request not allowed." })
}

// Expected body payload: same as auth-check's payload
async function getProfile(session: Session, req: NextApiRequest, res: NextApiResponse) {
  const userId = parseInt(req.query.userId as string)
  // Checking if requested fields are publically visible, if not, requires
  // requesting entity to have editting rights
  const seekProfile: ProfileRes = req.body.reqResource
  if (Object.keys(seekProfile).length == 0) {
    res.status(404).send({ message: "Profile not found." })
    return
  }
  const reqEventId: number | undefined = req.body.eventId
  const isPublicData = Object.keys(seekProfile).every(k => {
    if (!(k in PROFILE_WHITELIST)) {
      return false
    }
    return true
  })
  if (!isPublicData) {
    // "Edit rights" (more like view access) here includes host / mentor of
    // expeditions they joined
    const validReq = await userHasEditRights({
      resource: RESOURCE.Profile,
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
  const userProfile = await prisma.profile.findUnique({
    where: {
      userId: userId,
    },
    select: {
      userId: seekProfile.UserId === true,
      engName: seekProfile.EngName === true,
      isMale: seekProfile.IsMale === true,
      isStudent: seekProfile.IsStudent === true,
      majorYear: seekProfile.MajorYear === true,
      dateOfBirth: seekProfile.DateOfBirth === true,
      placeOfBirth: seekProfile.PlaceOfBirth === true,
      isTaiwanese: seekProfile.IsTaiwanese === true,
      nationalId: seekProfile.NationalId === true,
      passportNumber: seekProfile.PassportNumber === true,
      nationality: seekProfile.Nationality === true,
      address: seekProfile.Address === true,
      emergencyContactName: seekProfile.EmergencyContactName === true,
      emergencyContactPhone: seekProfile.EmergencyContactPhone === true,
      emergencyContactMobile: seekProfile.EmergencyContactMobile === true,
      beneficiaryName: seekProfile.BeneficiaryName === true,
      beneficiaryRelation: seekProfile.BeneficiaryRelation === true,
      riceAmount: seekProfile.RiceAmount === true,
      foodPreference: seekProfile.FoodPreference === true,
    }
  })
  if (!userProfile) {
    res.status(404).send({ message: "User profile not found." })
    return
  }
  res.status(200).send({ data: userProfile, message: "User profile: successfully found." })
}

/*
  Expected body payload:
    formData: profile + minProfile (see prisma schema)
*/
async function updateProfile(session: Session, req: NextApiRequest, res: NextApiResponse) {
  const userId = parseInt(req.query.userId as string)
  const validReq = await userHasEditRights({
    resource: RESOURCE.Profile,
    payload: {
      userId: session.user.id,
      targetUserId: userId,
    }
  })
  if (!validReq) {
    res.status(403).send({ message: "Invalid request." })
    return
  }
  const formData: ProfileData = req.body.formData
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      minProfile: {
        upsert: {
          create: {
            name: formData.name,
            mobileNumber: formData.mobileNumber,
            phoneNumber: formData.phoneNumber,
          },
          update: {
            name: formData.name,
            mobileNumber: formData.mobileNumber,
            phoneNumber: formData.phoneNumber,
          }
        }
      },
      profile: {
        upsert: {
          update: {
            isMale: formData.isMale === 'true',
            isStudent: formData.isStudent === 'true',
            majorYear: formData.majorYear ? formData.majorYear : null,
            isTaiwanese: formData.isTaiwanese === 'true',
            nationalId: formData.nationalId ? formData.nationalId : null,
            engName: formData.engName ? formData.engName : null,
            passportNumber: formData.passportNumber ? formData.passportNumber : null,
            nationality: formData.nationality ? formData.nationality : null,
            dateOfBirth: new Date(formData.dateOfBirth),
            placeOfBirth: formData.placeOfBirth,
            address: formData.address,
            emergencyContactName: formData.emergencyContactName,
            emergencyContactMobile: formData.emergencyContactMobile,
            emergencyContactPhone: formData.emergencyContactPhone ? formData.emergencyContactPhone : null,
            beneficiaryName: formData.beneficiaryName,
            beneficiaryRelation: formData.beneficiaryRelation,
            riceAmount: parseFloat(formData.riceAmount as unknown as string),
            foodPreference: formData.foodPreference ? formData.foodPreference : null
          },
          create: {
            isMale: formData.isMale === 'true',
            isStudent: formData.isStudent === 'true',
            majorYear: formData.majorYear ? formData.majorYear : null,
            isTaiwanese: formData.isTaiwanese === 'true',
            nationalId: formData.nationalId ? formData.nationalId : null,
            engName: formData.engName ? formData.engName : null,
            passportNumber: formData.passportNumber ? formData.passportNumber : null,
            nationality: formData.nationality ? formData.nationality : null,
            dateOfBirth: new Date(formData.dateOfBirth),
            placeOfBirth: formData.placeOfBirth,
            address: formData.address,
            emergencyContactName: formData.emergencyContactName,
            emergencyContactMobile: formData.emergencyContactMobile,
            emergencyContactPhone: formData.emergencyContactPhone ? formData.emergencyContactPhone : null,
            beneficiaryName: formData.beneficiaryName,
            beneficiaryRelation: formData.beneficiaryRelation,
            riceAmount: parseFloat(formData.riceAmount as unknown as string),
            foodPreference: formData.foodPreference ? formData.foodPreference : null
          }
        }
      }
    }
  }).then(() => {
    res.status(200).json({ message: 'Successfully updated / created user profile.' })
  }).catch(err => {
    console.log(err)
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // TODO: give context to error (add in user id?)
    }
    res.status(500).json({ message: "Updating / creating new profile failed." })
  })
}
