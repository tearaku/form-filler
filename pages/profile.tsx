import { useSession, getSession } from "next-auth/react"
import Layout from "../components/layout"
import type { NextPageContext } from "next"
import AccessDenied from "../components/access-denied"
import { useEffect, useState } from "react"
import UserProfile from "../components/profile/user-profile"
import MinimalProfile from "../components/profile/minimal-profile"

export default function Profile(props) {
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

  useEffect(() => {
    console.log("Alt profile state: ", altProfile)
  }, [altProfile])

  return (
    <Layout>
      <h1>個人資料</h1>
      <button className="btn btn-accent" onClick={() => setAltProfile(toggle => !toggle)}>
        {!altProfile && <p> 我是留守/山難 || 簡易資料</p>}
        {altProfile && <p> 我是出隊隊員 || 一罐作業資料</p>}
      </button>
      <article>註：若剛更新資料且未看到網頁，請稍先後片刻！</article>
      {!altProfile &&
        <UserProfile userId={session.user.id} />
      }
      {altProfile && 
        <MinimalProfile userId={session.user.id} />
      }
    </Layout>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      session: await getSession(context),
    },
  }
}