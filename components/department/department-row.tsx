import { Department, MinimalProfile, Profile } from "@prisma/client"
import useSWR from "swr"
import DepartmentModalCard from "./department-del-modal"

interface PropType {
  deptInfo: Department
  rowIdx: number
  viewerIsAdmin: boolean
}

export default function DepartmentRow({ deptInfo, rowIdx, viewerIsAdmin }: PropType) {
  const fetcher = url => fetch(url).then(res => res.json())
  const { data: resProfile, error } = useSWR(`/api/profile/${deptInfo.userId}`, fetcher)

  if (!resProfile) return <tr key={`member_${rowIdx}`}>Loading...</tr>
  if (error) return <tr key={`member_${rowIdx}`}>Error in loading user data!</tr>

  return (
    <tr key={`member_${rowIdx}`}>
      <th></th>
      <td>{deptInfo.description}</td>
      <td>
        <div className="flex items-center space-x-3">
          <div>
            {(resProfile.data.minProfile as MinimalProfile).name}
          </div>
          {viewerIsAdmin &&
            <a href={`#user_${deptInfo.userId}`} className="btn btn-sm btn-outline btn-error font-bold">
              移除
            </a>
          }
        </div>
      </td>
      <td>{(resProfile.data.profile as Profile).majorYear}</td>
      {viewerIsAdmin && 
        <DepartmentModalCard 
          deptInfo={deptInfo}
          name={resProfile.data.minProfile.name}
          majorYear={resProfile.data.profile.majorYear}
          viewerIsAdmin={viewerIsAdmin} />
      }
    </tr>
  )
}

// ClubLeader
// CoLeader
// ControlAndRescue /// 山難部
// Guide /// 嚮導部
// Equipment /// 社產組
// Finance /// 總務 --> should be called Treasurer xd
// Record /// 檔案組
// Tech /// 技術組
// WebAdmin /// 網管