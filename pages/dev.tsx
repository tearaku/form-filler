import { useSession, getSession } from "next-auth/react"
import Layout from "../components/layout"
import type { NextPageContext } from "next"
import AccessDenied from "../components/access-denied"
import { useEffect } from "react"
import UserProfile from "../components/user-profile"

export default function Dev(props) {
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
    console.log(props.user)
  })

  return (
    <Layout>
      <h1>個人資料</h1>
      <UserProfile userId={session.user.id} userData={props.user} />
    </Layout>
  )
}

async function fetchUserProfile(id: number) {
  const userProfile = await prisma.profile.findUnique({
    where: {
      userId: id,
    }
  })
  const _dateOfBirth = userProfile.dateOfBirth.toJSON()
  const dateOfBirth = _dateOfBirth.slice(0, _dateOfBirth.indexOf("T"))
  const riceAmount = userProfile.riceAmount.toJSON()
  const isMale = userProfile.isMale ? "true" : "false"
  const isTaiwanese = userProfile.isTaiwanese ? "true" : "false"
  const isStudent = userProfile.isStudent ? "true" : "false"
  return {
    ...userProfile,
    dateOfBirth: dateOfBirth,
    riceAmount: riceAmount,
    isMale: isMale,
    isStudent: isStudent,
    isTaiwanese: isTaiwanese,
  }
}

export async function getServerSideProps(context: NextPageContext) {
  const fetchedSession = await getSession(context)
  const userProfile = await fetchUserProfile(fetchedSession.user.id)
  return {
    props: {
      session: fetchedSession,
      user: userProfile,
    },
  }
}