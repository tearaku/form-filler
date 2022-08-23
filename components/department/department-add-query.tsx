import { useRouter } from "next/router"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"

interface PropType {
  userInfo: {
    userId: number
    name: string
    isStudent: boolean
    majorYear: string
  }
}

interface FormData {
  userId: number
  assignedDept: string
}


export default function DepartmentAddQuery({ userInfo }: PropType) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const router = useRouter()
  const [waitSubmit, setWaitSubmit] = useState(false)

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setWaitSubmit(true)
    const submitPromise = fetch("/api/department", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: data.userId,
        description: data.assignedDept,
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
    setWaitSubmit(false)
    if (!res.ok) {
      const resData = await res.json()
      toast.error(`錯誤： ${resData.message}`)
      return
    }
    toast.success("幹部新增成功！")
    router.reload()
  }

  return (
    <tr key={`qUser_${userInfo.userId}`}>
      <th></th>
      <td>{userInfo.name}</td>
      <td>{userInfo.majorYear}</td>
      <td className="justify-items-center">
        {userInfo.isStudent &&
          <a href={`#add_user_${userInfo.userId}`} className="btn btn-sm btn-outline font-bold">新增幹部</a>}
        {!userInfo.isStudent &&
          <a className="btn btn-sm btn-outline btn-disabled font-bold">非在校生</a>}
      </td>
      {userInfo.isStudent &&
        <div className="modal" id={`add_user_${userInfo.userId}`}> <div className="modal-box">
          <h3 className="font-bold text-lg items-center">{userInfo.name}</h3>
          <h3 className="text-lg items-center">{userInfo.majorYear}</h3>
          <div className="divider">指定職位</div>
          <form onSubmit={handleSubmit(onSubmit)} className="form-control">
            <div>
              <label className="label">職位</label>
              <input {...register("assignedDept", { required: true })} type="text" className="input input-bordered w-full max-w-xs" placeholder="職位不可重複，用數字代表複數（例：總務1）" />
              {errors.assignedDept && <p style={{ color: 'red' }}>請填職位名稱！</p>}
            </div> <br />
            <input {...register("userId", { required: true })} type="number" defaultValue={userInfo.userId} hidden={true} />
            <button type="submit" className="btn btn-outline btn-success">
              確認
              {waitSubmit &&
                <progress className="progress w-50"></progress>}
            </button>
          </form>
          <div className="modal-action">
            <a href="#" className="btn">Close</a>
          </div>
        </div></div>
      }
    </tr >
  )
}
