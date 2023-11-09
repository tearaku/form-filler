import { MinimalProfile, Profile, Attendance, EventRole } from "@prisma/client"
import { EventData_API } from "../components/event/event-type"

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

export function canViewFood(aList: Attendance[], viewerId: number): boolean {
  return aList.some(att => {
    if (att.userId == viewerId) {
      if (att.role == EventRole.Host || att.role == EventRole.Mentor) {
        return true
      }
      return att.jobs?.includes("大廚")
    }
  });
}

/** Requires checking both role & job description, as the following people can edit:
  * (a) admin roles
  * (b) those appointed to equipment management job
  */
export function canAccessEquip(role: string, aList: Attendance[], viewerId: number): boolean {
  if (hasAdminRights(role)) return true;
  return aList
    .filter(att => {
      return (att.userId === viewerId) && (att.jobs?.includes("裝備"));
    })
    .length > 0;
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
