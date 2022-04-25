import { useSession, getSession } from "next-auth/react"
import Layout from "../../../../components/layout"
import type { NextPageContext } from "next"
import AccessDenied from "../../../../components/access-denied"
import { useEffect } from "react"
import prisma from "../../../../utils/prisma"
import { useRouter } from "next/router"
import { EventData_API } from "../../../../components/event/event-type"
import { PrismaClient, EventRole } from "@prisma/client"
import { mapEventRoleEnum, parseDateString } from "../../../../utils/api-parse"

interface PropType {
  valid: boolean,
  data: {
    eventName: string
    beginDate: string
    endDate: string
    role: string
  }
}

export default function JoinEvent(props: PropType) {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const router = useRouter()

  const joinSuccess = async (eventId, userId, joinRole) => {
    // TODO: managing failed requests... (more specific failure messages)
    const res = await fetch(`/api/event/${eventId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        role: joinRole,
      })
    })
    const resData = await res.json()
    if (!res.ok) {
      alert(`Error: ${resData.message}`)
      return
    }
    alert(resData.message)
    router.push("/event")
  }

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
        <main><h1>第一次使用嗎？請先登入且填寫「一慣作業資料」；若為山難／留守，可只先填寫「簡易資料」即可。</h1></main>
      </Layout>
    )
  }

  useEffect(() => {
    console.log(props)
  })

  return (
    <Layout>
      <h1>加入隊伍</h1>
      {(!props.valid) &&
        <main>
          <h2 style={{ color: 'red' }}>查無此活動／邀請網址有誤！</h2>
          <small style={{ color: 'red' }}>Err: event with given id is not found, or invite url is incorrect.</small>
        </main>}
      {(props.valid) &&
        <main>
          <h2>活動名稱：{props.data.eventName}</h2>
          <h2>活動日期：{props.data.beginDate}～{props.data.endDate}</h2>
          <h2>參與身份：{mapEventRoleEnum(props.data.role)}</h2>
          <button onClick={() => joinSuccess(router.query.eventId, session.user.id, props.data.role)} className="btn btn-success">確認參與</button>
        </main>}
    </Layout>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  // Default to "member" role if not specified
  let response = {
    valid: true,
    data: {
      eventName: "",
      beginDate: "",
      endDate: "",
      role: ("role" in context.query) ? context.query.role as string : "Member",
    }
  }
  if (!Object.keys(EventRole).some(value => (value == response.data.role) && (value != EventRole.Host))) {
    response.valid = false
    return {
      props: {
        session: await getSession(context),
        ...response
      },
    }
  }
  const event = await prisma.event.findUnique({
    where: {
      id: parseInt(context.query.eventId as string),
    },
    rejectOnNotFound: true,
  }).catch(err => {
    response.valid = false
  })
  if (event) {
    response.data.beginDate = parseDateString(event.beginDate.toISOString())
    response.data.endDate = parseDateString(event.endDate.toISOString())
    response.data.eventName = event.title
    response.valid = context.query.inviteToken == event.inviteToken
    console.log(event.inviteToken)
  }
  return {
    props: {
      session: await getSession(context),
      ...response
    },
  }
}