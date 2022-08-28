import { Attendance, EventRole } from "@prisma/client";
import useSWR from "swr";
import { mapEventRoleEnum } from "../../utils/api-parse";
import AttendanceModalCard from "./attendance-modal-card";
import { MinProfileRes, ProfileRes } from "../../types/resources";
import { profileFetcher, minProfileFetcher } from "../../utils/fetcher";

interface PropType {
  memberInfo: Attendance
  index: number
  viewer: {
    id: number
    role: string
  }
}

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

const seekPubData: MinProfileRes = {
  Name: true,
  UserId: true,
}

// Members of "Watcher" & "Rescue" role only consented to their partial information
function didConsentFull(role: EventRole): ProfileRes {
  if ((role == EventRole.Watcher) ||
    (role == EventRole.Rescue)) {
    return {}
  }
  return seekProfile
}

export default function AttendanceRow({ memberInfo, index, viewer }: PropType) {
  // TODO: this guy here needs access to EVERYTHING, as long as viewer
  // has admin rights (is host or mentor)
  const { data: resProfile, error: resProfileErr } = useSWR(
    [`/api/profile/${memberInfo.userId}`, didConsentFull(memberInfo.role), memberInfo.eventId],
    profileFetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.status == 404) return
    }
  })

  // Full min profile fetch (for modal)
  const { data: resMProfile, error: resMProfileErr } = useSWR(
    [`/api/minProfile/${memberInfo.userId}`, seekMinProfile, memberInfo.eventId],
    minProfileFetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.status == 404) return
    }
  })
  // Partial min profile fetch (public data)
  const { data: pubMProfile, error: pubMProfileErr } = useSWR(
    [`/api/minProfile/${memberInfo.userId}`, seekPubData, memberInfo.eventId],
    minProfileFetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      console.log(error)
      // Never retry on 404.
      if (error.status == 404) return
    }
  })

  const fetcher = url => fetch(url).then(res => res.json())
  const { data: resUser, error: resUserErr } = useSWR(`/api/user/${memberInfo.userId}`, fetcher)

  if (!resProfile || !resMProfile || !pubMProfile || !resUser) return <tr key={`member_${index}`}>Loading...</tr>
  if (resProfileErr || resMProfileErr || pubMProfileErr || resUserErr) return <tr key={`member_${index}`}>Error in loading user data!</tr>

  return (
    <tr key={`member_${index}`}>
      <th></th>
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask mask-squircle w-12 h-12">
              <img src={resUser.data.image} />
            </div>
          </div>
          <div>
            <a href={`#user_${memberInfo.userId}`} className="btn btn-sm btn-outline font-bold">
              {pubMProfile.data ? pubMProfile.data.name : "無資料"}
              <span className="material-icons">&#xe89e;</span>
            </a>
            <div className="text-sm opacity-70">FB：{resUser.data.name}</div>
          </div>
        </div>
      </td>
      <td>{mapEventRoleEnum(memberInfo.role)}</td>
      <td>{memberInfo.jobs}</td>
      {pubMProfile.data ?
        <AttendanceModalCard profile={resProfile.data} minProfile={resMProfile.data} attendance={memberInfo} viewer={viewer} /> : null}
    </tr>
  )
}
