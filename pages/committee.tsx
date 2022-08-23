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
import { useEffect } from "react"

interface PropType {
  session: Session
  committees: Department[]
  viewerIsAdmin: boolean
}

export default function CommitteePage(props: PropType) {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  if (loading) return <Layout><h1>Loading...</h1></Layout>
  if (!session) return <Layout><AccessDenied /></Layout>

  return (
    <Layout>
      <h1>幹部資料</h1>
      {props.viewerIsAdmin &&
        <div>
          <div className="divider">新增幹部</div>
          <DepartmentAdd />
        </div>}
      <div className="divider">幹部名單＆修改</div>
      <DepartmentList deptInfo={props.committees} viewerIsAdmin={props.viewerIsAdmin} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sessionObj = await unstable_getServerSession(context.req, context.res, authOptions)
  const committees = await prisma.department.findMany()
  // TODO: remove this hard-coded value of webadmin
  const viewerRole = committees.find((dept) => {
    return (dept.userId == sessionObj.user.id) && (dept.description.includes("網管"))
  })
  return {
    props: {
      session: sessionObj,
      committees: committees,
      viewerIsAdmin: viewerRole ? true : false,
    },
  }
}
