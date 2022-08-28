import primsa from "../utils/prisma"
import { EventRole } from '@prisma/client'

export enum MINPROFILE_WHITELIST {
  UserId,
  Name,
}

export enum PROFILE_WHITELIST {
  UserId,
  EngName,
  IsMale,
  IsStudent,
  MajorYear,
}

export enum RESOURCE {
  Event,
  User,
  Profile,
  MinProfile,
  Department
}

export interface RequestContext {
  resource: RESOURCE
  payload: any
}

/*
Expected payload: {
  id: number,
  userId: number,
}
*/
async function checkEvent(payload: any): Promise<boolean> {
  try {
    const roleInEvent = await prisma.attendance.findUnique({
      where: {
        eventId_userId: {
          eventId: payload.id,
          userId: payload.userId,
        },
      },
      rejectOnNotFound: true,
    })
    if ((roleInEvent.role == EventRole.Host)
      || (roleInEvent.role == EventRole.Mentor)) {
      return true
    }
  } catch (e) {
    // Catch key errors here too
    return false
  }
  return false
}

/*
Expected payload: {
  userId: number,
}
*/
async function checkDept(payload: any): Promise<boolean> {
  try {
    await prisma.department.findFirst({
      where: {
        userId: payload.userId,
        OR: [
          {
            description: {
              contains: "社長",
            }
          },
          {
            description: {
              contains: "網管",
            }
          },
        ]
      },
      rejectOnNotFound: true,
    })
    return true
  } catch (e) {
    return false
  }
}

/*
Expected payload: {
  // Requesting entity's userId
  userId: number,
  targetUserId: number,
  eventId?: number,
}
*/
async function checkProfile(payload: any): Promise<boolean> {
  console.log(payload)
  // Requesting entity is owner themselves
  if (payload.userId == payload.targetUserId) {
    return true
  }
  if (payload.eventId == undefined) {
    return false
  }
  console.log("Request from non-owner...")
  // Requesting entity has view access (host / mentor of joined expedition
  const eInfo = await prisma.event.findUnique({
    where: {
      id: payload.eventId as number,
    },
    include: {
      attendants: true,
    }
  })
  const isAdmin = eInfo.attendants.some(att => {
    if (att.userId == payload.userId) {
      if ((att.role == EventRole.Host) ||
        (att.role == EventRole.Mentor)) {
        return true
      }
    }
    return false
  })
  console.log("Requesting entity isAdmin?: " + (isAdmin === true))
  if (isAdmin) {
    const targetIsMember = eInfo.attendants.some(att => {
      if (att.userId == payload.targetUserId) {
        // Rescue & watchers: did not consent to their whole profile data (only
        // those contained in MinProfile)
        if ((att.role != EventRole.Rescue) &&
          (att.role != EventRole.Watcher)) {
          return true
        }
      }
      return false
    })
    console.log("Requested entity is a proper member?: " + (targetIsMember === true))
    if (targetIsMember) {
      return true
    }
  }
  return false
}

/*
Expected payload: {
  // Requesting entity's userId
  userId: number,
  targetUserId: number,
  eventId?: number,
}
*/
async function checkMProfile(payload: any): Promise<boolean> {
  // Requesting entity is owner themselves
  if (payload.userId == payload.targetUserId) {
    return true
  }
  if (payload.eventId == undefined) {
    return false
  }
  // Requesting entity has view access (host / mentor of joined expedition
  const eInfo = await prisma.event.findUnique({
    where: {
      id: payload.eventId as number,
    },
    include: {
      attendants: true,
    }
  })
  const isAdmin = eInfo.attendants.some(att => {
    if (att.userId == payload.userId) {
      if ((att.role == EventRole.Host) ||
        (att.role == EventRole.Mentor)) {
        return true
      }
    }
    return false
  })
  if (isAdmin) {
    const targetIsParticipant = eInfo.attendants.some(att => {
      if (att.userId == payload.targetUserId) {
        return true
      }
      return false
    })
    if (targetIsParticipant) {
      return true
    }
  }
  return false
}

// Does session validity check & for requesting entity's rights to modify requested data
export async function userHasEditRights(context: RequestContext): Promise<boolean> {
  switch (context.resource) {
    case RESOURCE.Event:
      return await checkEvent(context.payload)
    case RESOURCE.Department:
      return await checkDept(context.payload)
    case RESOURCE.MinProfile:
      return await checkMProfile(context.payload)
    case RESOURCE.Profile:
      return await checkProfile(context.payload)
    default:
      return false
  }
}
