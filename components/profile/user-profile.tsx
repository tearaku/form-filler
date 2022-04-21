import UserProfileForm from "./profile-form"
import useSWR from "swr"
import { MinimalProfileData, ProfileData } from "../user-profile-type"

export default function UserProfile(props) {
  const fetcher = url => fetch(url).then(res => res.json())
  const { data, error } = useSWR(`/api/profile/${props.userId}`, fetcher)

  return (
    <div>
      {!data && <p>Loading profile...</p>}
      {data && <UserProfileForm userData={parseProfileData(data)} />}
    </div>
  )
}

function parseProfileData(userData) {
  const userProfile: ProfileData = userData.profile
  const minUserProfile: MinimalProfileData = userData.minProfile
  const dateOfBirth = userProfile.dateOfBirth.slice(0, userProfile.dateOfBirth.indexOf("T"))
  const isMale = userProfile.isMale ? "true" : "false"
  const isTaiwanese = userProfile.isTaiwanese ? "true" : "false"
  const isStudent = userProfile.isStudent ? "true" : "false"
  return {
    hasFullProfile: userProfile ? true: false,
    profile: {
      ...userProfile,
      dateOfBirth: dateOfBirth,
      isMale: isMale,
      isStudent: isStudent,
      isTaiwanese: isTaiwanese,
    },
    minProfile: minUserProfile,
  }
}