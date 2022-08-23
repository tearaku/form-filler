import { PrismaClient, User, Event, Attendance } from '@prisma/client'
import { eventData } from './event'
import { userData } from './user'
import { write, writeFile } from 'fs'

const prisma = new PrismaClient()

async function main() {
  console.log("Begin seeding...")
  
  console.log("Seeding users and their profiles / min profiles...")
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user ${user.name} with id ${user.id}`)
  }
  const userProfile = await prisma.profile.findMany({
    orderBy: {userId: "asc"},
  })
  const userMProfile = await prisma.minimalProfile.findMany()
  const deptList = await prisma.department.findMany()

  console.log("Seeding events and their attendances...")
  var eventList: Event[] = []
  for (const e of eventData) {
    const event = await prisma.event.create({
      data: {
        ...e,
        attendants: {
          createMany: {
            data: [
              {userId: userProfile[0].userId, role: "Host", jobs: "領隊、證保"},
              {userId: userProfile[1].userId, role: "Mentor", jobs: "輔隊"},
              {userId: userProfile[2].userId, role: "Member", jobs: "大廚、裝備、學員"},
              {userId: userProfile[3].userId, role: "Member"},
              {userId: userMProfile[4].userId, role: "Rescue"},
              {userId: userMProfile[5].userId, role: "Watcher"},
              {userId: userMProfile[6].userId, role: "Watcher"},
            ],
          }
        }
      }
    })
    eventList.push(event)
    console.log(`Created event [${event.beginDate} ~ ${event.endDate}] ${event.title} w/ id ${event.id}`)
  }
  var eventInfoList = await Promise.all(eventList.map(async (e) => {
    const attendance = await prisma.attendance.findMany({
      where: {
        eventId: e.id
      }
    })
    return {
      ...e,
      attendants: attendance,
    }
  }))

  console.log("Converting data to JSON for backend testing...")
  const dataSrc = {
    profile: userProfile,
    minProfile: userMProfile,
    event: eventInfoList,
    department: deptList,
  }
  const jsonData = JSON.stringify(dataSrc)
  writeFile("prisma/seedData.json", jsonData, 'utf-8', (err) => {
    if (err) {
      console.error(err)
      throw err
    }
  })
  console.log("Seeding complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })