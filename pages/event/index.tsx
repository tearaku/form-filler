import useSWR from "swr"
import { unstable_getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"

import AccessDenied from "../../components/access-denied"
import EventList from "../../components/event/event-list"
import EventReminderModal from "../../components/event/reminder-modal"
import Layout from "../../components/layout"
import type { GetServerSideProps } from "next"
import { authOptions } from "../api/auth/[...nextauth]"

export default function Event(props) {
  const fetcher = (url, date) => fetch(url).then(res => res.json())

  const { data: session, status } = useSession()
  const { data, error } = useSWR([`/api/event`, new Date().toDateString()], fetcher)

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  if (error) return <Layout>Failed to load data!</Layout>
  if (!data) return <Layout>Loading...</Layout>

  return (
    <Layout>
      <h1>隊伍清單</h1>
      {/** @ts-ignore */}
      <button onClick={() => document.getElementById("event_creation_reminder_modal").showModal()} className="btn btn-outline btn-success">
        新增隊伍
      </button>
      <EventReminderModal />
      <EventList events={data.data} />
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
