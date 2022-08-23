import type { NextApiRequest, NextApiResponse } from 'next'
import { ProfileData } from '../../../components/profile/user-profile-type'
import prisma from '../../../utils/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET request
  if (req.method == "GET") {
    const userId = parseInt(req.query.userId as string)
    const userProfile = await prisma.profile.findUnique({
      where: {
        userId: userId,
      },
    })

    const minUserProfile = await prisma.minimalProfile.findUnique({
      where: {
        userId: userId,
      },
    })
    if (!minUserProfile) {
      res.status(500).send({ message: "Minimal user profile not found." })
      return
    }

    res.status(200).send({
      data: {
        profile: userProfile,
        minProfile: minUserProfile,
      },
      message: "User profile: successfully found.",
    })
    return
  }

  // POST request
  if (req.method == "POST") {
    const userId = parseInt(req.query.userId as string)
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
              riceAmount: parseInt(formData.riceAmount as unknown as string),
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
              riceAmount: parseInt(formData.riceAmount as unknown as string),
              foodPreference: formData.foodPreference ? formData.foodPreference : null
            }
          }
        }
      }
    }).then(() => {
      res.status(200).json({ message: 'Successfully updated / created user profile.' })
    }).catch(err => {
      console.log(err)
      res.status(500).json({ message: "Updating / creating new profile failed." })
    })
    return
  }

  res.status(405).send({ message: "Request not allowed." })
}
