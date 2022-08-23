import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { Profile, MinimalProfile } from "@prisma/client"
import DepartmentAddQuery from "./department-add-query"
import { toast } from "react-toastify"

interface FormData {
  name: string
}

export default function DepartmentAdd() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [waitResponse, setWaitResponse] = useState(false)
  const [qProfileList, setQProfileList] = useState<Profile[]>([])
  const [qMinProfileList, setQMinProfileList] = useState<MinimalProfile[]>([])

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setWaitResponse(true)
    const submitPromise = fetch(`/api/profile/name/${data.name}`)
    const res = await toast.promise(
      submitPromise,
      {
        pending: {
          render() {
            return "Submitting data to server..."
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
    if (!res.ok) {
      toast.error(`錯誤：${resData.message}`)
      return
    }
    setQMinProfileList(resData.minProfileList)
    setQProfileList(resData.profileList)
    setWaitResponse(false)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full max-w-xs">
          <label className="label">以姓名查詢</label>
          <input {...register("name", { required: true })} type="text" placeholder="中文全名" className="input input-bordered w-full max-w-xs" />
          {errors.name && <p style={{ color: 'red' }}>請填要新增的幹部名子！</p>}
          <button type="submit" className="btn btn-outline btn-success">
            查詢
            {waitResponse &&
              <progress className="progress w-50"></progress>}
          </button>
        </div>
      </form>
      {(qMinProfileList.length > 0 && qProfileList.length > 0) &&
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th></th>
              <td>姓名</td>
              <td>系級</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {qMinProfileList.map((member, index) => {
              return (<DepartmentAddQuery userInfo={{
                userId: member.userId,
                name: member.name,
                isStudent: qProfileList.at(index).isStudent,
                majorYear: qProfileList.at(index).majorYear,
              }}
              />)
            })}
          </tbody>
        </table>
      }
    </div>
  )
}
