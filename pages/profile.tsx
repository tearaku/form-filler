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
import { ProfileRes, MinProfileRes } from '../types/resources'
import { minProfileFetcher, profileFetcher } from "../utils/fetcher"

const seekProfile: ProfileRes = {
  UserId: true,
  EngName: true,
  IsMale: true,
  IsStudent: true,
  MajorYear: true,
  DateOfBirth: true,
  PlaceOfBirth: true,
  IsTaiwanese: true,
  NationalId: true,
  Nationality: true,
  PassportNumber: true,
  Address: true,
  EmergencyContactName: true,
  EmergencyContactPhone: true,
  EmergencyContactMobile: true,
  BeneficiaryName: true,
  BeneficiaryRelation: true,
  RiceAmount: true,
  FoodPreference: true,
}
const seekMinProfile: MinProfileRes = {
  UserId: true,
  Name: true,
  MobileNumber: true,
  PhoneNumber: true,
}

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

  const { data: resProfile, error: resProfileErr } = useSWR(
    [`/api/profile/${session.user.id}`, seekProfile],
    profileFetcher)
  const { data: resMProfile, error: resMProfileErr } = useSWR(
    [`/api/minProfile/${session.user.id}`, seekMinProfile],
    minProfileFetcher)

  if (!resProfile || !resMProfile) return <Layout><h1>Loading profile...</h1></Layout>
  if (resProfileErr || resMProfileErr) return <Layout><h1>Error in loading user data!</h1></Layout>

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
      <article>註：若剛更新資料且未看到網頁更新，請稍先後片刻！</article>
      {!altProfile &&
        <UserProfileForm userData={parseProfileData(resProfile.data, resMProfile.data)} readOnly={false} />
      }
      {altProfile &&
        <MinimalProfileForm userData={resMProfile.data} readOnly={false} />
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
