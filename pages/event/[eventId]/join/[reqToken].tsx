import { useSession } from "next-auth/react"
import { authOptions } from "../../../api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import Layout from "../../../../components/layout"
import type { GetServerSideProps } from "next"
import AccessDenied from "../../../../components/access-denied"
import prisma from "../../../../utils/prisma"
import { useRouter } from "next/router"
import { EventRole } from "@prisma/client"
import { mapEventRoleEnum, parseDateString } from "../../../../utils/api-parse"
import { toast } from "react-toastify"
import { createHmac } from "crypto"

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
  const router = useRouter()

  const joinSuccess = async (eventId, userId, joinRole) => {
    // TODO: managing failed requests... (more specific failure messages)
    const submitPromise = fetch(`/api/event/${eventId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        role: joinRole,
        reqToken: router.query.reqToken,
      })
    })
    const res = await toast.promise(
      submitPromise,
      {
        pending: {
          render() {
            return "Submitting data to server..."
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
    const resData = await res.json()
    if (res.ok) {
      toast.success(resData.message)
      router.push("/event")
    } else {
      toast.error(`Error: ${resData.message}`)
    }
  }

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
        <main>
          <h1>第一次使用嗎？請先登入且填寫「一慣作業資料」；若為山難／留守，可只先填寫「簡易資料」即可（之後出隊依舊需要填寫完整的資料歐）。</h1>
          <h2>填寫完畢後，請記得返回此頁面按下「確認參與」歐！</h2>
        </main>
      </Layout>
    )
  }

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

export const getServerSideProps: GetServerSideProps = async (context) => {
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

  // Disallow joining as Host (since I'm using inputs from URL xdd)
  if (!Object.keys(EventRole).some(value => (value == response.data.role) && (value != EventRole.Host))) {
    response.valid = false
    return {
      props: {
        session: await unstable_getServerSession(context.req, context.res, authOptions),
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
    // verify query param against hmac
    const hmac = createHmac('sha512', 'a very public thing')
    hmac.update(response.data.role)
    hmac.update(event.inviteToken)
    const digest = hmac.digest('hex')
    response.valid = context.query.reqToken == digest
  }

  return {
    props: {
      session: await unstable_getServerSession(context.req, context.res, authOptions),
      ...response
    },
  }
}
