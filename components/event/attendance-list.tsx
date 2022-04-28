import { Attendance } from "@prisma/client"
import AttendanceRow from "./attendance-row"

interface PropType {
  memberList: Attendance[]
  viewer: {
    id: number
    role: string
  }
}

export default function AttendanceList({ memberList, viewer }: PropType) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th></th>
            <td>姓名</td>
            <td>身份</td>
            <td>業務</td>
          </tr>
        </thead>
        <tbody>
          {memberList.map((value, index) => {
            return(<AttendanceRow memberInfo={value} index={index} viewer={viewer}/>)
          })}
        </tbody>
      </table>
    </div>
  )
}