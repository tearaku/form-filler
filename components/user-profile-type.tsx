export type ProfileData = {
  name: string,
  isMale: string,
  isStudent: string,
  majorYear?: string,
  isTaiwanese: string,
  nationalId?: string,
  engName?: string,
  passportNumber?: string,
  dateOfBirth: string,
  placeOfBirth: string,
  address: string,
  mobileNumber: string,
  phoneNumber: string,
  emergencyContactName: string,
  emergencyContactMobile: string,
  emergencyContactPhone: string,
  beneficiaryName: string,
  beneficiaryRelation: string,
  riceAmount: number,
  foodPreference?: string,
}

export type MinimalProfileData = {
  name: string,
  mobileNumber: string,
  phoneNumber: string,
}