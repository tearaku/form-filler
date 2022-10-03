import { Attendance, EventRole } from "@prisma/client"
import { MinProfileRes, ProfileRes } from "../../types/resources";
import useSWR from "swr";
import { profileFetcher, minProfileFetcher } from "../../utils/fetcher";
import { useContext, useEffect } from "react";
import { FoodPrefContext, FoodPrefContextProvider } from "../../contexts/food-pref-context";

interface PropType {
  memberList: Attendance[]
}

export default function FoodPreferenceModal({ memberList }: PropType) {
  const menuState = useContext(FoodPrefContext)

  return (
    <div className="modal" id={`menu`}> <div className="modal-box">
      <main className="mb-6">
        <h1 className="font-bold text-lg items-center">人員食性</h1>
        <h3>總米兩：{menuState.riceAmount}</h3>
        <h3>男女比：{menuState.numOfMales} - {menuState.numOfFemales}</h3>
        <h3>一餐餅乾數量（以男2/3女1/2條算）：{computeCookieCount(menuState)}</h3>
        <h3>請先確保大家有好好填寫食量＆食性，再拿上列計算歐！</h3>
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
              // Only want to count those that aren't going out
              if (member.role == EventRole.Rescue || member.role == EventRole.Watcher) {
                return
              }
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
  // To communicate w/ its parent --> for totalling rice amount
  const menuContext = useContext(FoodPrefContext)

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

  // Updating food context
  useEffect(() => {
    if (!resProfile || !resProfile.data) { return }
    if (resProfile.data.IsMale) {
      menuContext.setNumOfFemales()
    } else {
      menuContext.setNumOfMales()
    }
    menuContext.setRiceAmount(parseFloat(resProfile.data.riceAmount))
  }, [resProfile])

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
      <td>{resProfile.data ? resProfile.data.riceAmount : "無資料"}</td>
      <td>{resProfile.data ? resProfile.data.foodPreference : "無資料"}</td>
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

const computeCookieCount = (foodContext): number => {
  return (foodContext.numOfMales * (2 / 3)) + (foodContext.numOfFemales * (1 / 2))
}
