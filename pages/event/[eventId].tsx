import type { GetServerSideProps } from "next"
import { createHmac } from "crypto"
import { authOptions } from "../api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import useSWR from "swr"
import AttendanceList from "../../components/event/attendance-list"
import { EquipData, EventData, EventData_API } from "../../components/event/event-type"
import EventRegister from "../../components/event/register"
import { equipBaseList, techBaseList } from "../../components/event/register"
import Layout from "../../components/layout"
import { parseDateString, hasAdminRights, canViewFood } from "../../utils/api-parse"
import { toast } from "react-toastify"
import FoodPreferenceModal from "../../components/event/food-preference-modal"

export default function EventPage() {
  const { data: session, status } = useSession()
  const [viewerRole, setViewerRole] = useState("visitor")
  const [eventData, setEventData] = useState<EventData_API>()
  const [editMode, toggleEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [waitSubmit, setWaitSubmit] = useState(false)

  const router = useRouter()

  const fetcher = url => fetch(url).then(res => res.json())
  const { data, error } = useSWR(`/api/event/${router.query.eventId}`, fetcher)

  useEffect(() => {
    if (!data) { return }
    setEventData({
      ...data.data,
      beginDate: parseDateString((data.data as EventData_API).beginDate as string),
      endDate: parseDateString((data.data as EventData_API).endDate as string),
    })
  }, [data])

  useEffect(() => {
    if (!eventData) { return }
    const viewer = eventData.attendants.find(member => {
      return (member.userId == session.user.id)
    })
    if (viewer) {
      setViewerRole(viewer.role)
    }
  }, [eventData])

  function copyInviteLink(role: string) {
    // create simple HMAC of invite token & host
    const hmac = createHmac('sha512', 'a very public thing')
    hmac.update(role)
    hmac.update(eventData.inviteToken)
    const digest = hmac.digest('hex')

    // path already contains prefix '/'
    navigator.clipboard.writeText(
      `${document.location.origin}${document.location.pathname}/join/${digest}?role=${role}`
    ).then(() => {
      toast.success("Link copied!", { autoClose: 1000 })
    }).catch(() => {
      toast.error("Failed to copy link.", { autoClose: 1000 })
    })
  }

  const generateFiles = async () => {
    try {
      setWaitSubmit(true)
      const submitPromise = fetch(`/api/event/${router.query.eventId}/gen`)
      const res = await toast.promise(
        submitPromise,
        {
          pending: {
            render() {
              return "Generating form files from server... it may take a while."
            },
            icon: false,
          },
          error: {
            render() {
              return "There's an error in submitting your data, please try again"
            },
          },
        }
      )
      setWaitSubmit(false)
      // TODO: how do I get more meaningful error msg from client-side?
      if (!res.ok) {
        toast.error("Error in fetching data from server")
        return
      }
      const fBlob = await res.blob()
      const objURL = window.URL.createObjectURL(fBlob)
      window.open(objURL)
      window.URL.revokeObjectURL(objURL)
    } catch (e) {
      // TODO: more descriptive
      toast.error(`Error: ${e}`)
      setWaitSubmit(false)
    }
  }

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
          <div>
            {eventData && canViewFood(eventData.attendants, session.user.id) &&
              <div>
                <a href={`#menu`} className="btn btn-warning font-bold">
                  <span className="material-icons">&#xe56c;</span>
                  人員食性
                </a>
                <FoodPreferenceModal memberList={eventData.attendants} />
              </div>
            }
            {hasAdminRights(viewerRole) &&
              <div>
                <button onClick={() => toggleEditMode(prev => !prev)} className="btn btn-info">
                  {editMode ? <span className="material-icons">&#xe3c9;</span> : <span className="material-icons">&#xe950;</span>}
                  編輯模式 {editMode ? "ON" : "OFF"}
                </button>
                <button onClick={generateFiles} className="btn btn-success">
                  <span className="material-icons">&#xe2c4;</span>
                  生成＆下載文件
                  {waitSubmit &&
                    <progress className="progress w-50"></progress>}
                </button>
              </div>}
            {!eventData && <p>Loading event data...</p>}
            {eventData &&
              <EventRegister readMode={!editMode} userId={session.user.id}
                eventInfo={{ eventData: eventData_toForm(eventData), eventId: eventData.id }}
              />
            }
          </div>
        </main>}
      {activeTab == 1 &&
        <main>
          {hasAdminRights(viewerRole) &&
            <div>
              <div className="divider">邀請連結</div>
              <div className="grid grid-cols-4 justify-items-center">
                <button className="btn btn-info btn-outline" onClick={() => copyInviteLink("Mentor")}>
                  <span className="material-icons">&#xE14D;</span>
                  輔領
                </button>
                <button className="btn btn-warning btn-outline" onClick={() => copyInviteLink("Rescue")}>
                  <span className="material-icons">&#xE14D;</span>
                  山難
                </button>
                <button className="btn btn-error btn-outline" onClick={() => copyInviteLink("Watcher")}>
                  <span className="material-icons">&#xE14D;</span>
                  留守
                </button>
                <button className="btn btn-outline" onClick={() => copyInviteLink("Member")}>
                  <span className="material-icons">&#xE14D;</span>
                  隊員
                </button>
              </div>
            </div>}
          <div className="divider">成員列表</div>
          {!eventData && <p>Loading event data...</p>}
          {eventData && <AttendanceList memberList={eventData.attendants} viewer={{ id: session.user.id, role: viewerRole }} />}
        </main>}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await unstable_getServerSession(context.req, context.res, authOptions),
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
