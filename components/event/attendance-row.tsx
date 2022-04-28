import { MinimalProfile, EventRole, Attendance } from "@prisma/client";
import useSWR from "swr";
import { mapEventRoleEnum } from "../../utils/api-parse";
import AttendanceModalCard from "./attendance-modal-card";

interface PropType {
  memberInfo: Attendance
  index: number
  viewer: {
    id: number
    role: string
  }
}

export default function AttendanceRow({ memberInfo, index, viewer }: PropType) {
  const fetcher = url => fetch(url).then(res => res.json())
  const { data: resProfile, error: resProfileErr } = useSWR(`/api/profile/${memberInfo.userId}`, fetcher)
  const { data: resUser, error: resUserErr } = useSWR(`/api/user/${memberInfo.userId}`, fetcher)

  if (!resProfile || !resUser) return <tr key={`member_${index}`}>Loading...</tr>
  if (resProfileErr || resUserErr) return <tr key={`member_${index}`}>Error in loading user data!</tr>

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
            <a href={`#user_${memberInfo.userId}`} className="btn btn-sm btn-outline font-bold">{(resProfile.data.minProfile as MinimalProfile).name}</a>
            <div className="text-sm opacity-70">FB：{resUser.data.name}</div>
          </div>
        </div>
      </td>
      <td>{mapEventRoleEnum(memberInfo.role)}</td>
      <td>{memberInfo.jobs}</td>
      <AttendanceModalCard profile={resProfile.data.profile} minProfile={resProfile.data.minProfile} attendance={memberInfo} viewer={viewer} />
    </tr>
  )
}