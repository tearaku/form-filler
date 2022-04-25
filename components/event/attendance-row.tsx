import { MinimalProfile } from "@prisma/client";
import Image from "next/image";
import { useEffect } from "react";
import useSWR from "swr";
import { Attendance } from "../../types/attendance";
import { mapEventRoleEnum } from "../../utils/api-parse";

interface PropType {
  memberInfo: Attendance
  index: number
}

export default function AttendanceRow({ memberInfo, index }: PropType) {
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
            <div className="font-bold">{(resProfile.data.minProfile as MinimalProfile).name}</div>
            <div className="text-sm opacity-50">FB：{resUser.data.name}</div>
          </div>
        </div>
      </td>
      <td>{mapEventRoleEnum(memberInfo.role)}</td>
      <td>{memberInfo.jobs}</td>
    </tr>
  )
}