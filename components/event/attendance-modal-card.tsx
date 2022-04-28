import { Attendance, MinimalProfile, Profile } from "@prisma/client"
import { useRouter } from "next/router"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { hasAdminRights, parseProfileData } from "../../utils/api-parse"
import MinimalProfileForm from "../profile/minimal-profile"
import UserProfileForm from "../profile/profile-form"

interface PropType {
  profile?: Profile
  minProfile: MinimalProfile
  attendance: Attendance
  viewer: {
    id: number
    role: string
  }
}

type FormData = {
  attendance: Attendance
}

export default function AttendanceModalCard({ profile, minProfile, viewer, attendance }: PropType) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      attendance: attendance,
    }
  })

  const [confirmDelete, setConfirmDelete] = useState(false)
  async function kickMember() {
    const res = await fetch(`/api/user/${attendance.userId}/attendance/${attendance.eventId}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formData: {
          ...attendance,
          toRemove: confirmDelete,
        },
      }),
    })
    const resData = await res.json()
    alert(resData.message)
    router.push("/event")
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const res = await fetch(`/api/user/${data.attendance.userId}/attendance/${data.attendance.eventId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formData: {
          ...data.attendance,
        }
      })
    })
    const resData = await res.json()
    alert(resData.message)
    router.push("/event")
  }

  return (
    <div className="modal" id={`user_${minProfile.userId}`}> <div className="modal-box">
      <h3 className="font-bold text-lg items-center">{minProfile.name}</h3>
      <div className="divider">成員資料</div>
      {hasAdminRights(viewer.role) && <>
        {!profile &&
          <MinimalProfileForm userId={minProfile.userId} userData={parseProfileData({ profile: null, minProfile: minProfile }).minProfile} readOnly={true} />}
        {profile &&
          <UserProfileForm readOnly={true} userId={minProfile.userId} userData={parseProfileData({ profile: profile as any, minProfile: minProfile })} />}
        <div className="divider">成員身份</div>
        <form onSubmit={handleSubmit(onSubmit)} className="form-control">
          <div className="grid grid-cols-2">
            <label className="label justify-center">身份</label>
            <label className="label justify-center">業務</label>
            <select {...register("attendance.role", { required: true })} disabled={!editable(viewer, minProfile, true)} className="select select-primary max-w-xs">
              <option value={"Host"} disabled={true}>Host</option>
              <option value={"Mentor"}>Mentor</option>
              <option value={"Member"}>Member</option>
              <option value={"Watcher"}>Watcher</option>
              <option value={"Rescue"}>Rescue</option>
            </select>
            <input {...register("attendance.jobs")} disabled={!hasAdminRights(viewer.role)} type="text" className="input input-bordered w-full max-w-xs" />
            <input {...register("attendance.eventId")} type="number" hidden={true} />
            <input {...register("attendance.userId")} type="number" hidden={true} />
          </div>
          <button type="submit" className="btn btn-success btn-block">更新隊員資訊</button>
        </form>
        {editable(viewer, minProfile, true) &&
          <div>
            <button onClick={() => setConfirmDelete(true)} className="btn btn-warning btn-block btn-outline">Kick member</button>
            {confirmDelete &&
              <button onClick={kickMember} className="btn btn-error btn-block">Submit kick request</button>}
          </div>}
      </>}
      {!hasAdminRights(viewer.role) && <p>只有領隊／輔領隊才能看資料！</p>}
      <div className="modal-action">
        <a href="#" className="btn">Close</a>
      </div>
    </div></div>
  )
}

function editable(
  viewer: { id: number, role: string },
  minProfile: MinimalProfile,
  nonSelfOnly: boolean
): boolean {
  if (!nonSelfOnly) return (viewer.role != "Host") || (minProfile.userId == viewer.id)
  else return (viewer.role == "Host") && (minProfile.userId != viewer.id)
}