import { MinimalProfile, Profile } from "@prisma/client"

export function parseProfileData(profile: Profile, mProfile: MinimalProfile) {
  if (profile == null) {
    return ({ hasFullProfile: false, profile: null, minProfile: null })
  }
  return {
    hasFullProfile: profile ? true : false,
    profile: profile ? {
      ...profile,
      ...mProfile,
      // The dateOfBirth itself seemed to be ISOString already (WTF??)
      // @ts-ignore
      dateOfBirth: parseDateString(profile.dateOfBirth as string),
      isMale: profile.isMale ? "true" : "false",
      isStudent: profile.isStudent ? "true" : "false",
      isTaiwanese: profile.isTaiwanese ? "true" : "false",
      riceAmount: profile.riceAmount as unknown as number
    } : null,
    minProfile: mProfile,
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
