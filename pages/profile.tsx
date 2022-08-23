import { useSession } from "next-auth/react"
import { authOptions } from "../pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import Layout from "../components/layout"
import type { GetServerSideProps } from "next"
import AccessDenied from "../components/access-denied"
import { useEffect, useState } from "react"
import MinimalProfileForm from "../components/profile/minimal-profile"
import useSWR from "swr"
import UserProfileForm from "../components/profile/profile-form"
import { parseProfileData } from "../utils/api-parse"

export default function ProfilePage(props) {
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

  const [altProfile, setAltProfile] = useState(false)

  const fetcher = url => fetch(url).then(res => res.json())
  const { data, error } = useSWR(`/api/profile/${session.user.id}`, fetcher)

  if (!data) return <Layout><h1>Loading profile...</h1></Layout>

  return (
    <Layout>
      <div className="divider">
        <h1>個人資料</h1>
      </div>
      <div className="divider">
        {!altProfile && <p>【一慣作業資料】</p>}
        {altProfile && <p>【簡易資料】</p>}
      </div>
      <button className="btn btn-accent" onClick={() => setAltProfile(toggle => !toggle)}>
        {!altProfile && <p> 我是留守／山難【簡易資料】</p>}
        {altProfile && <p> 我是出隊隊員【一慣作業資料】</p>}
      </button>
      <article>註：若剛更新資料且未看到網頁，請稍先後片刻！</article>
      {!altProfile &&
        <UserProfileForm userData={parseProfileData(data.data)} userId={session.user.id} readOnly={false} />
      }
      {altProfile &&
        <MinimalProfileForm userData={parseProfileData(data.data).minProfile} userId={session.user.id} readOnly={false} />
      }
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
