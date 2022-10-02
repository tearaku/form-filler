import { Attendance } from "@prisma/client"
import { MinProfileRes, ProfileRes } from "../../types/resources";
import useSWR from "swr";
import { profileFetcher, minProfileFetcher } from "../../utils/fetcher";

interface PropType {
  memberList: Attendance[]
}

export default function FoodPreferenceModal({ memberList }: PropType) {
  return (
    <div className="modal" id={`menu`}> <div className="modal-box">
      <main className="mb-6">
        <h1 className="font-bold text-lg items-center">人員食性</h1>
      </main>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th></th>
              <td>姓名</td>
              <td>食量</td>
              <td>食性</td>
            </tr>
          </thead>
          <tbody>
            {memberList.map((member, idx) => {
              return (<FoodPreferenceRow member={member} index={idx} />)
            })}
          </tbody>
        </table>
      </div>
      <div className="modal-action">
        <a href="#" className="btn">Close</a>
      </div>
    </div></div>
  )
}


interface PropType_Row {
  member: Attendance
  index: number
}

function FoodPreferenceRow({ member, index }: PropType_Row) {
  const { data: resProfile, error: resProfileErr } = useSWR(
    [`/api/profile/${member.userId}`, seekProfile, member.eventId],
    profileFetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.status == 404) return
    }
  })

  // Full min profile fetch (for modal)
  const { data: resMProfile, error: resMProfileErr } = useSWR(
    [`/api/minProfile/${member.userId}`, seekMinProfile, member.eventId],
    minProfileFetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.status == 404) return
    }
  })

  if (!resProfile || !resMProfile) return <tr key={`member_${index}`}>Loading...</tr>
  if (resProfileErr || resMProfileErr) return <tr key={`member_${index}`}>Error in loading user data!</tr>

  return (
    <tr key={`member_${index}`}>
      <th></th>
      <td>
        <div className="flex items-center space-x-3">
          {resMProfile.data ? resMProfile.data.name : "無資料"}
        </div>
      </td>
      <td>{resProfile.data.riceAmount}</td>
      <td>{resProfile.data.foodPreference}</td>
    </tr>
  )
}

const seekProfile: ProfileRes = {
  UserId: true,
  IsMale: true,
  RiceAmount: true,
  FoodPreference: true,
}
const seekMinProfile: MinProfileRes = {
  UserId: true,
  Name: true,
}
