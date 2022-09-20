import Link from "next/link"
import useSWR from "swr"
import { Attendance } from "../../types/attendance"
import { parseDateString } from "../../utils/api-parse"
import { EventData_API } from "./event-type"
import { EventRole } from "@prisma/client"

interface PropType {
  eventData: EventData_API
}

// Returns: user id of the leader of expedition
function getLeader(attendants: Attendance[]): number {
  return attendants.find((att) => {
    if (att.role == EventRole.Host) {
      return att
    }
  }).userId
}

export default function EventRow({ eventData }: PropType) {
  const fetcher = url => fetch(url).then(res => res.json())
  const { data, error } = useSWR(`/api/minProfile/${getLeader(eventData.attendants)}`, fetcher)

  return (
    <tr>
      <th>
        <button className="btn btn-outline">
          <Link href={`/event/${eventData.id}`}><a>查看</a></Link>
        </button>
      </th>
      <td>{parseDateString(eventData.beginDate as string)}~{parseDateString(eventData.endDate as string)}</td>
      <td>{eventData.title}</td>
      <td>{eventData.category}</td>
      {!data && <td>讀取中...</td>}
      {error && <td>讀取錯誤！</td>}
      {data && <td>{data.name}</td>}
      <td>{eventData.location}</td>
    </tr>
  )
}
