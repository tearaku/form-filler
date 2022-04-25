import UserProfileForm from "./profile-form"
import useSWR from "swr"
import { MinimalProfileData, ProfileData } from "./user-profile-type"

export default function UserProfile(props) {
  const fetcher = url => fetch(url).then(res => res.json())
  const { data, error } = useSWR(`/api/profile/${props.userId}`, fetcher)

  return (
    <div>
      {!data && <p>Loading profile...</p>}
      {data && <UserProfileForm userData={parseProfileData(data.data)} userId={props.userId} />}
    </div>
  )
}

function parseProfileData(userData: { profile: ProfileData, minProfile: MinimalProfileData }) {
  if (userData == null) {
    return ({ hasFullProfile: false, profile: null, minProfile: null })
  }
  const userProfile: ProfileData = userData.profile
  const minUserProfile: MinimalProfileData = userData.minProfile
  return {
    hasFullProfile: userProfile ? true : false,
    profile: {
      ...userProfile,
      dateOfBirth: userProfile.dateOfBirth.slice(0, userProfile.dateOfBirth.indexOf("T")),
      isMale: userProfile.isMale ? "true" : "false",
      isStudent: userProfile.isStudent ? "true" : "false",
      isTaiwanese: userProfile.isTaiwanese ? "true" : "false",
    },
    minProfile: minUserProfile,
  }
}