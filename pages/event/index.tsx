import { useSession, getSession } from "next-auth/react"
import Layout from "../../components/layout"
import type { NextPageContext } from "next"
import AccessDenied from "../../components/access-denied"
import { useEffect } from "react"
import Link from "next/link"

export default function Event(props) {
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
    console.log("Current time is: ", new Date())
    console.log(props)
  })

  return (
    <Layout>
      <h1>隊伍清單</h1>
      <button className="btn btn-outline btn-success">
        <Link href="/event/create">
          <a>新增隊伍</a>
        </Link>
      </button>
    </Layout>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const eventList = await prisma.event.findMany({
    where: {
      beginDate: {
        lte: new Date(),
      },
    },
    orderBy: {
      beginDate: 'asc',
    }
  })
  return {
    props: {
      session: await getSession(context),
      events: eventList,
    },
  }
}