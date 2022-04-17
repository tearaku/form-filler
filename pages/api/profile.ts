import type { NextApiRequest, NextApiResponse } from 'next'
import { ProfileData } from '../../components/user-profile-type';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Request body: ", req.body)
  // POST request
  if (req.method == "POST") {
    const userId = req.body.userId
    const formData: ProfileData = req.body.formData
    const upsertedProfile = await prisma.profile.upsert({
      where: {
        userId: userId,
      },
      update: {
        name: formData.name,
        isMale: formData.isMale === 'true',
        isStudent: formData.isStudent === 'true',
        majorYear: formData.majorYear ? formData.majorYear : null,
        isTaiwanese: formData.isTaiwanese === 'true',
        nationalId: formData.nationalId ? formData.nationalId : null,
        engName: formData.engName ? formData.engName : null,
        passportNumber: formData.passportNumber ? formData.passportNumber : null,
        dateOfBirth: new Date(formData.dateOfBirth),
        placeOfBirth: formData.placeOfBirth,
        address: formData.address,
        mobileNumber: formData.mobileNumber,
        phoneNumber: formData.phoneNumber,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactMobile: formData.emergencyContactMobile,
        emergencyContactPhone: formData.emergencyContactPhone ? formData.emergencyContactPhone : null,
        beneficiaryName: formData.beneficiaryName,
        beneficiaryRelation: formData.beneficiaryRelation,
        riceAmount: parseInt(formData.riceAmount as unknown as string),
        foodPreference: formData.foodPreference ? formData.foodPreference : null
      },
      create: {
        user: { connect: { id: userId } },
        name: formData.name,
        isMale: formData.isMale === 'true',
        isStudent: formData.isStudent === 'true',
        majorYear: formData.majorYear ? formData.majorYear : null,
        isTaiwanese: formData.isTaiwanese === 'true',
        nationalId: formData.nationalId ? formData.nationalId : null,
        engName: formData.engName ? formData.engName : null,
        passportNumber: formData.passportNumber ? formData.passportNumber : null,
        dateOfBirth: new Date(formData.dateOfBirth),
        placeOfBirth: formData.placeOfBirth,
        address: formData.address,
        mobileNumber: formData.mobileNumber,
        phoneNumber: formData.phoneNumber,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactMobile: formData.emergencyContactMobile,
        emergencyContactPhone: formData.emergencyContactPhone ? formData.emergencyContactPhone : null,
        beneficiaryName: formData.beneficiaryName,
        beneficiaryRelation: formData.beneficiaryRelation,
        riceAmount: parseInt(formData.riceAmount as unknown as string),
        foodPreference: formData.foodPreference ? formData.foodPreference : null
      }
    })
    if (!upsertedProfile) {
      res.status(500).json({ message: "Updating / creating new profile failed." })
      return
    }
    console.log(req.body)
    res.status(200).json({ message: 'Successfully upserted user profile.' })
    return
  }

  // GET request
  if (req.method == "GET") {
    const userId = req.body.userId
    const userProfile = await prisma.profile.findUnique({
      where: {
        userId: userId
      },
      rejectOnNotFound: true,
    }).catch(err => {
      res.status(500).json({message: "User profile not found."})
      return
    })
    res.status(200).json(userProfile)
    return
  }

  res.status(405).json({message: "Request not allowed."})
}