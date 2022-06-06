import { useSession, getSession } from "next-auth/react"
import Layout from "../../components/layout"
import type { NextPageContext } from "next"
import AccessDenied from "../../components/access-denied"
import Link from "next/link"
import EventList from "../../components/event/event-list"
import prisma from "../../utils/prisma"
import { useEffect } from "react"

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

  return (
    <Layout>
      <h1>隊伍清單</h1>
      <button className="btn btn-outline btn-success">
        <Link href="/event/create">
          <a>新增隊伍</a>
        </Link>
      </button>
      <EventList events={props.events}/>
    </Layout>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const eventList = await prisma.event.findMany({
    where: {
      endDate: {
        gte: new Date(),
      },
    },
    include: {
      attendants: true,
    },
    orderBy: {
      beginDate: 'asc',
    }
  })
  const parsedEventList = eventList.map(target => {
    return ({
      ...target,
      beginDate: target.beginDate.toISOString(),
      endDate: target.endDate.toISOString(),
    })
  })
  return {
    props: {
      session: await getSession(context),
      events: parsedEventList,
    },
  }
}