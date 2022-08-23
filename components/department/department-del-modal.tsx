import { Department, MinimalProfile, Profile } from "@prisma/client"
import { useRouter } from "next/router"
import { toast } from "react-toastify"

interface PropType {
  deptInfo: Department
  name: string
  majorYear: string
  viewerIsAdmin: boolean
}

export default function DepartmentModalCard({ deptInfo, name, majorYear, viewerIsAdmin }: PropType) {
  const router = useRouter()

  const revokePosition = async () => {
    if (!viewerIsAdmin) {
      toast.error("只有網管可以更改幹部資料表！")
      return
    }
    const submitPromise = fetch(`/api/department`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...deptInfo
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
    if (res.ok) {
      toast.success("刪除成功！")
      router.reload()
    } else {
      const errMsg = await res.json()
      toast.error(`錯誤：${errMsg.message}`)
    }
  }

  return (
    <div className="modal" id={`user_${deptInfo.userId}`}> <div className="modal-box">
      <div className="divider">刪除幹部</div>
      <h3 className="font-bold text-lg items-center">名字：{name}</h3>
      <h3 className="font-bold text-lg items-center">系級：{majorYear}</h3>
      <h3 className="font-bold text-lg items-center">職位：{deptInfo.description}</h3>
      <button onClick={revokePosition} className="btn btn-error" disabled={!viewerIsAdmin}>確認刪除</button>
      <div className="modal-action">
        <a href="#" className="btn">Close</a>
      </div>
    </div> </div>
  )
}
