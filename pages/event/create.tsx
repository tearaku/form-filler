import { authOptions } from "../api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import Layout from "../../components/layout"
import type { GetServerSideProps } from "next"
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

  return (
    <Layout>
      <h1>新增隊伍</h1>
      <EventRegister readMode={false} userId={session.user.id} />
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
