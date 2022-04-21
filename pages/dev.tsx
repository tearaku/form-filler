import { useSession, getSession } from "next-auth/react"
import Layout from "../components/layout"
import type { NextPageContext } from "next"
import AccessDenied from "../components/access-denied"
import { useEffect, useState } from "react"
import UserProfile from "../components/profile/user-profile"
import useSWR from "swr"

export default function Dev() {
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
  const [profileData, setProfileData] = useState()
  const [profileIsReady, setProfileisReady] = useState(false)
  const fetcher = url => fetch(url).then(res => res.json())
  const { data, error } = useSWR(`/api/profile/${session.user.id}`, fetcher)

  useEffect(() => {
    const parsedData = parseProfileData(data)
    setProfileData(parsedData)
    setProfileisReady(true)
  }, [error])

  return (
    <Layout>
      <h1>個人資料</h1>
      {error && <h1>Error in fetching the profile data!</h1>}
      {!data && <h1>Fetching profile data...</h1>}
      {profileIsReady &&
        <UserProfile userId={session.user.id} userData={profileData} />}
    </Layout>
  )
}

function parseProfileData(userProfile) {
  const dateOfBirth = userProfile.dateOfBirth.slice(0, userProfile.dateOfBirth.indexOf("T"))
  const isMale = userProfile.isMale ? "true" : "false"
  const isTaiwanese = userProfile.isTaiwanese ? "true" : "false"
  const isStudent = userProfile.isStudent ? "true" : "false"
  return {
    ...userProfile,
    dateOfBirth: dateOfBirth,
    isMale: isMale,
    isStudent: isStudent,
    isTaiwanese: isTaiwanese,
  }
}

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      session: await getSession(context),
    },
  }
}