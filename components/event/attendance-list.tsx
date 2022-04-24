import { Attendance } from "../../types/attendance"
import AttendanceRow from "./attendance-row"

interface PropType {
  memberList: Attendance[]
}

export default function AttendanceList({ memberList }: PropType) {
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
            return(<AttendanceRow memberInfo={value} index={index}/>)
          })}
        </tbody>
      </table>
    </div>
  )
}