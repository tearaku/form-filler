import { Department } from "@prisma/client"
import useSWR from "swr"
import DepartmentModalCard from "./department-del-modal"
import { ProfileRes, MinProfileRes } from '../../types/resources'
import { profileFetcher, minProfileFetcher } from "../../utils/fetcher"

interface PropType {
  deptInfo: Department
  viewerIsAdmin: boolean
}

const seekProfile: ProfileRes = {
  MajorYear: true,
}
const seekMinProfile: MinProfileRes = {
  Name: true,
}

export default function DepartmentRow({ deptInfo, viewerIsAdmin }: PropType) {
  const { data: resProfile, error: resProfileErr } = useSWR(
    [`/api/profile/${deptInfo.userId}`, seekProfile],
    profileFetcher)

  const { data: resMProfile, error: resMProfileErr } = useSWR(
    [`/api/minProfile/${deptInfo.userId}`, seekMinProfile],
    minProfileFetcher)

  if (!resProfile || !resMProfile) return <tr><td>Loading...</td></tr>
  if (resProfileErr || resMProfileErr) return <tr><td>Error in loading user data!</td></tr>

  return (
    <tr>
      <th></th>
      <td>{deptInfo.description}</td>
      <td>
        <div className="flex items-center space-x-3">
          <div>{resMProfile.data.name}</div>
          {viewerIsAdmin ?
            <a href={`#user_${deptInfo.userId}`} className="btn btn-sm btn-outline btn-error font-bold">
              移除
            </a> : null
          }
          {viewerIsAdmin ?
            <DepartmentModalCard
              deptInfo={deptInfo}
              name={resMProfile.data.name}
              majorYear={resProfile.data.majorYear}
              viewerIsAdmin={viewerIsAdmin} /> : null
          }
        </div>
      </td>
      <td>{resProfile.data.majorYear}</td>
    </tr>
  )
}
