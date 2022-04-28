import { MinimalProfileData, ProfileData } from "../components/profile/user-profile-type"

export function parseProfileData(userData: { profile: ProfileData, minProfile: MinimalProfileData }) {
  if (userData == null) {
    return ({ hasFullProfile: false, profile: null, minProfile: null })
  }
  const userProfile: ProfileData = userData.profile
  const minUserProfile: MinimalProfileData = userData.minProfile
  return {
    hasFullProfile: userProfile ? true : false,
    profile: userProfile ? {
      ...userProfile,
      dateOfBirth: userProfile.dateOfBirth.slice(0, userProfile.dateOfBirth.indexOf("T")),
      isMale: userProfile.isMale ? "true" : "false",
      isStudent: userProfile.isStudent ? "true" : "false",
      isTaiwanese: userProfile.isTaiwanese ? "true" : "false",
    }: null,
    minProfile: minUserProfile,
  }
}

export function hasAdminRights(role: string): boolean {
  if ((role == "Host") || (role == "Mentor")) return true
  return false
}

export function parseDateString(dateStr: string): string {
  return dateStr.substring(0, dateStr.indexOf("T"))
}

export function mapEventRoleEnum(role: string): string {
  switch (role) {
    case "Host":
      return "領隊"
    case "Mentor":
      return "輔領"
    case "Member":
      return "出隊成員"
    case "Rescue":
      return "山難"
    case "Watcher":
      return "留守"
    default:
      return ""
  }
}