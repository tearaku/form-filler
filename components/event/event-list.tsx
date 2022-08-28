import EventRow from "./event-row"

export default function EventList(props) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th></th>
            <td>活動日期</td>
            <td>隊伍名稱</td>
            <td>類別</td>
            <td>領隊</td>
            <td>活動地點</td>
          </tr>
        </thead>
        <tbody>
          {props.events.map((curEvent) => {
            return (<EventRow eventData={curEvent} key={`event_${curEvent.id}`} />)
          })}
        </tbody>
      </table>
    </div>
  )
}
