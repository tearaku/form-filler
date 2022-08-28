import { useSession } from "next-auth/react"
import { authOptions } from "../pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import type { GetServerSideProps } from "next"
import Layout from "../components/layout"
import prisma from "../utils/prisma"
import { Department } from "@prisma/client"
import AccessDenied from "../components/access-denied"
import { Session } from "next-auth"
import DepartmentList from "../components/department/department-list"
import DepartmentAdd from "../components/department/department-add"
import { useEffect, useState } from "react"
import useSWR from "swr"

export default function CommitteePage(props) {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  const fetcher = url => fetch(url).then(res => res.json())
  const { data, error } = useSWR(`/api/department`, fetcher)

  const [viewerIsAdmin, setViewerIsAdmin] = useState(false)
  const [deptInfo, setDeptInfo] = useState<Department[]>([])

  useEffect(() => {
    if (!data) {
      return
    }
    setDeptInfo(data.data)
  }, [data])

  // Separating them as immediately using deptInfo in above
  // may return empty instead
  useEffect(() => {
    deptInfo.find((dept) => {
      if (dept.userId == session.user.id) {
        if (dept.description.includes("網管") || dept.description.includes("社長")) {
          setViewerIsAdmin(true)
          return true
        }
      }
    })
  }, [deptInfo])

  if (loading) return <Layout><h1>Loading...</h1></Layout>
  if (!session) return <Layout><AccessDenied /></Layout>

  if (!data) return <Layout><h1>Loading data...</h1></Layout>
  if (error) return <Layout><h1>There's error in loading committee data</h1></Layout>

  return (
    <Layout>
      <h1>幹部資料</h1>
      {viewerIsAdmin &&
        <div>
          <div className="divider">新增幹部</div>
          <DepartmentAdd />
        </div>}
      <div className="divider">幹部名單＆修改</div>
      <DepartmentList deptInfo={deptInfo} viewerIsAdmin={viewerIsAdmin} />
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
