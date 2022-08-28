import { Department } from "@prisma/client"
import DepartmentRow from "./department-row"

interface PropType {
  deptInfo: Department[]
  viewerIsAdmin: boolean
}

export default function DepartmentList({ deptInfo, viewerIsAdmin }: PropType) {

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th></th>
            <td>職位</td>
            <td>姓名</td>
            <td>系級</td>
          </tr>
        </thead>
        <tbody>
          {deptInfo.map((member, index) => {
            return (<DepartmentRow deptInfo={member} viewerIsAdmin={viewerIsAdmin} key={`member_${index}`} />)
          })}
        </tbody>
      </table>
    </div>
  )
}
