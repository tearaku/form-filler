import type { NextPageContext } from "next"
import { getSession, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import useSWR from "swr"
import AttendanceList from "../../components/event/attendance-list"
import { EquipData, EventData, EventData_API } from "../../components/event/event-type"
import EventRegister from "../../components/event/register"
import { equipBaseList, techBaseList } from "../../components/event/register"
import Layout from "../../components/layout"
import { parseDateString, hasAdminRights } from "../../utils/api-parse"

export default function EventPage() {
  const { data: session, status } = useSession()
  const [viewerRole, setViewerRole] = useState("visitor")
  const [eventData, setEventData] = useState<EventData_API>()
  const [editMode, toggleEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  const router = useRouter()

  const fetcher = url => fetch(url).then(res => res.json())
  const { data, error } = useSWR(`/api/event/${router.query.eventId}`, fetcher)

  useEffect(() => {
    if (!data) {
      return
    }

    setEventData({
      ...data.data,
      beginDate: parseDateString((data.data as EventData_API).beginDate as string),
      endDate: parseDateString((data.data as EventData_API).endDate as string),
    })
  }, [data])

  useEffect(() => {
    if (!eventData) {
      return
    }
    const viewer = eventData.attendants.find(member => {
      return (member.userId == session.user.id)
    })
    if (viewer) {
      setViewerRole(viewer.role)
    }
  }, [eventData])

  return (
    <Layout>
      <h1>你的身份是：{viewerRole}</h1>
      <div className="btn-group grid grid-cols-2">
        <button onClick={() => { setActiveTab(0) }} className="btn btn-outline">隊伍基本資料</button>
        <button onClick={() => { setActiveTab(1) }} className="btn btn-outline">相關成員資料</button>
      </div>
      <br />
      {activeTab == 0 &&
        <main>
          {hasAdminRights(viewerRole) &&
            <button onClick={() => toggleEditMode(prev => !prev)} className="btn btn-info">編輯模式 {!editMode ? "ON" : "OFF"}</button>}
          {!eventData && <p>Loading event data...</p>}
          {eventData &&
            <EventRegister readMode={!editMode} userId={session.user.id}
              eventInfo={{ eventData: eventData_toForm(eventData), eventId: eventData.id }}
            />
          }
        </main>}
      {activeTab == 1 &&
        <main>
          <AttendanceList memberList={eventData.attendants} viewer={{id: session.user.id, role: viewerRole}} />
        </main>}
    </Layout>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      session: await getSession(context),
    },
  }
}

function eventData_toForm(source: EventData_API): EventData {
  const {
    equipList, equipDes, techEquipList, techEquipDes,
    id, inviteToken, attendants,
    ...rest
  } = source
  const fullEquipList = equipList.map((value, index): EquipData => {
    return ({
      name: value,
      des: equipDes.at(index),
    })
  })
  const fullTechEquipList = techEquipList.map((value, index): EquipData => {
    return ({
      name: value,
      des: techEquipDes.at(index),
    })
  })
  return ({
    ...rest,
    equip: [...fullEquipList.slice(0, equipBaseList.length)],
    equip_add: [...fullEquipList.slice(equipBaseList.length)],
    techEquip: [...fullTechEquipList.slice(0, techBaseList.length)],
    techEquip_add: [...fullTechEquipList.slice(techBaseList.length)],
  })
}