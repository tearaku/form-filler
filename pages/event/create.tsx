import { useSession, getSession } from "next-auth/react"
import Layout from "../../components/layout"
import type { NextPageContext } from "next"
import AccessDenied from "../../components/access-denied"
import { useEffect } from "react"
import EventRegister from "../../components/event/register"

export default function CreateEvent(props) {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  useEffect(() => {
    console.log(props)
  })

  return (
    <Layout>
      <h1>新增隊伍</h1>
      <EventRegister />
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