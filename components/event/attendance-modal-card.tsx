import { Attendance, MinimalProfile, Profile } from "@prisma/client"
import { useRouter } from "next/router"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
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
  const [waitSubmit, setWaitSubmit] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      attendance: attendance,
    }
  })

  const [confirmDelete, setConfirmDelete] = useState(false)
  async function kickMember() {
    setWaitSubmit(true)
    const submitPromise = fetch(`/api/user/${attendance.userId}/attendance/${attendance.eventId}`, {
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
    const res = await toast.promise(
      submitPromise,
      {
        pending: {
          render() {
            return "Submitting data..."
          },
          icon: false,
        },
        error: {
          render() {
            return "There's an error in submitting your data, please try again"
          },
        },
      }
    )
    const resData = await res.json()
    setWaitSubmit(false)
    toast.info(resData.message)
    router.push("/event")
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setWaitSubmit(true)
    const submitPromise = fetch(`/api/user/${data.attendance.userId}/attendance/${data.attendance.eventId}`, {
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
    const res = await toast.promise(
      submitPromise,
      {
        pending: {
          render() {
            return "Submitting data..."
          },
          icon: false,
        },
        error: {
          render() {
            return "There's an error in submitting your data, please try again"
          },
        },
      }
    )
    const resData = await res.json()
    setWaitSubmit(false)
    toast.info(resData.message)
    router.push("/event")
  }

  if (!hasAdminRights(viewer.role)) return <></>

  return (
    <div className="modal" id={`user_${minProfile.userId}`}> <div className="modal-box">
      <h3 className="font-bold text-lg items-center">{minProfile.name}</h3>
      <div className="divider">成員資料</div>
      {hasAdminRights(viewer.role) && <>
        {!profile &&
          <MinimalProfileForm userData={minProfile} readOnly={true} />}
        {profile &&
          <UserProfileForm userData={parseProfileData(profile, minProfile)} readOnly={true} />}
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
          <button type="submit" className="btn btn-success btn-block">
            <span className="material-icons">&#xe161;</span>
            更新隊員資訊
            {waitSubmit &&
              <progress className="progress w-100"></progress>}
          </button>
        </form>
        {editable(viewer, minProfile, true) &&
          <div>
            <button onClick={() => setConfirmDelete(true)} className="btn btn-warning btn-block btn-outline">Kick member</button>
            {confirmDelete &&
              <button onClick={kickMember} className="btn btn-error btn-block">Submit kick request</button>}
          </div>}
      </>}
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
