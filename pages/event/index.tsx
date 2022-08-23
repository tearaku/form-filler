import { useSession } from "next-auth/react"
import { authOptions } from "../api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import Layout from "../../components/layout"
import type { GetServerSideProps } from "next"
import AccessDenied from "../../components/access-denied"
import Link from "next/link"
import EventList from "../../components/event/event-list"
import useSWR from "swr"

export default function Event(props) {
  const { data: session, status } = useSession()

  const fetcher = (url, date) => fetch(url).then(res => res.json())
  const { data, error } = useSWR(["/api/event", new Date().toDateString()], fetcher)

  if (error) return <Layout>Failed to load data!</Layout>
  if (!data) return <Layout>Loading...</Layout>

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
