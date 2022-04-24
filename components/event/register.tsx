import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { EquipData, EventData, EventData_API } from "./event-type"
import { useEffect } from "react"

export const equipBaseList = ["帳棚", "鍋組（含湯瓢、鍋夾）", "爐頭", "Gas", "糧食", "預備糧", "山刀", "鋸子", "路標", "衛星電話", "收音機", "無線電", "傘帶", "Sling", "無鎖鉤環", "急救包", "GPS", "包溫瓶"]
export const techBaseList = ["主繩", "吊帶", "上升器", "下降器", "岩盔", "有鎖鉤環", "救生衣"]

interface PropType {
  userId: number
  readMode: boolean
  eventInfo?: {
    eventData: EventData
    eventId: number
  }
}

export default function EventRegister({ userId, readMode, eventInfo }: PropType) {
  const router = useRouter()

  const { register, control, handleSubmit, watch, formState: { errors } } = !eventInfo ? useForm<EventData>() :
    useForm({
      defaultValues: {
        ...eventInfo.eventData,
      }
    })
  const equipFields = useFieldArray({ name: 'equip_add', control })
  const techEquipFields = useFieldArray({ name: 'techEquip_add', control })

  const onSubmit: SubmitHandler<EventData> = async (data) => {
    const apiEndpoint = (eventInfo) ? `/api/event/${eventInfo.eventId}`: `/api/event`
    const res = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        formData: {
          ...data,
        },
      })
    })
    const res_data = await res.json()
    alert(res_data.message)
    if (res.ok) {
      alert("Redirecting back to main page...")
      router.push("/");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="divider"><h1>基本隊伍資訊</h1></div>
      <div className="form-control w-full max-w-s grid grid-cols-2">
        <div>
          <label className="label">隊伍名稱</label>
          <input {...register("title", { required: true })} type="text" placeholder="Type here" disabled={readMode} className="input input-bordered w-full max-w-xs" />
          {errors.title && <p style={{ color: 'red' }}>請填寫隊伍名稱！</p>}
        </div>
        <div>
          <label className="label">活動地點</label>
          <input {...register("location", { required: true })} type="text" placeholder="Type here" disabled={readMode} className="input input-bordered w-full max-w-xs" />
          {errors.location && <p style={{ color: 'red' }}>請填寫隊伍地點！</p>}
        </div>
        <div>
          <label className="label">開始日期</label>
          <input {...register("beginDate", { required: true })} type="date" disabled={readMode} className="input input-bordered w-full max-w-xs" />
          {errors.beginDate && <p style={{ color: 'red' }}>請填選開始日期！</p>}
        </div>
        <div>
          <label className="label">隊伍分級</label>
          <input {...register("category", { required: true })} type="text" placeholder="Type here" disabled={readMode} className="input input-bordered w-full max-w-xs" />
          {errors.category && <p style={{ color: 'red' }}>請填寫隊伍分級！</p>}
        </div>
        <div>
          <label className="label">結束日期</label>
          <input {...register("endDate", { required: true })} type="date" disabled={readMode} className="input input-bordered w-full max-w-xs" />
          {errors.endDate && <p style={{ color: 'red' }}>請填選結束日期！</p>}
        </div>
        <div>
          <label className="label">群隊</label>
          <input {...register("groupCategory")} type="text" placeholder="Type here" disabled={readMode} className="input input-bordered w-full max-w-xs" />
        </div>
        <div>
          <label className="label">包車</label>
          <input {...register("drivers")} type="text" placeholder="Type here" disabled={readMode} className="input input-bordered w-full max-w-xs" />
        </div>
        <div>
          <label className="label">包車電話</label>
          <input {...register("driversNumber")} type="text" placeholder="Type here" disabled={readMode} className="input input-bordered w-full max-w-xs" />
        </div>
        <div>
          <label className="label">無線電頻道</label>
          <input {...register("radioFreq", { required: true })} type="text" placeholder="Type here" disabled={readMode} className="input input-bordered w-full max-w-xs" />
          {errors.radioFreq && <p style={{ color: 'red' }}>請填寫無線電頻道！</p>}
        </div>
        <div>
          <label className="label">無線電台號</label>
          <input {...register("radioCodename", { required: true })} type="text" placeholder="Type here" disabled={readMode} className="input input-bordered w-full max-w-xs" />
          {errors.radioCodename && <p style={{ color: 'red' }}>請填寫無線電台號！</p>}
        </div>
      </div>
      <div>
        <label className="label">行程</label>
        <textarea {...register("tripOverview", { required: true })} className="textarea textarea-bordered resize w-2/3" disabled={readMode} placeholder="Type here"></textarea>
        {errors.tripOverview && <p style={{ color: 'red' }}>請填寫行程！</p>}
      </div>
      <div>
        <label className="label">山難時間</label>
        <input {...register("rescueTime", { required: true })} type="text" placeholder="Type here" disabled={readMode} className="input input-bordered w-full max-w-xs" />
        {errors.rescueTime && <p style={{ color: 'red' }}>請填寫山難時間！</p>}
      </div>
      <div>
        <label className="label">撤退計畫</label>
        <textarea {...register("retreatPlan")} disabled={readMode} className="textarea textarea-bordered resize w-2/3" placeholder="Type here"></textarea>
      </div>
      <div>
        <label className="label">參考地圖座標系統與地圖集名稱</label>
        <input {...register("mapCoordSystem", { required: true })} type="text" placeholder="Type here" disabled={readMode} className="input input-bordered w-full max-w-xs" />
        {errors.mapCoordSystem && <p style={{ color: 'red' }}>請填寫參考地圖座標系統與地圖集名稱！</p>}
      </div>
      <div>
        <label className="label">參考記錄</label>
        <textarea {...register("records", { required: true })} disabled={readMode} className="textarea textarea-bordered resize w-2/3" placeholder="Type here"></textarea>
        {errors.records && <p style={{ color: 'red' }}>請填寫參考記錄！</p>}
      </div>
      <div className="divider"><h1>裝備列表</h1></div>
      <div className="form-control w-full max-w-s grid grid-cols-3">
        {equipBaseList.map((value, index) => {
          return (
            <div key={value}>
              <label className="label">{value}</label>
              <input {...register(`equip.${index}.name`)} type="text" hidden={true} defaultValue={value} />
              <input {...register(`equip.${index}.des`)} type="text" placeholder="Type here" disabled={readMode} className="input input-bordered w-full max-w-xs" />
            </div>
          )
        })}
      </div>
      <div className="form-control w-full max-w-s grid grid-cols-3">
        {equipFields.fields.map((field, index) => {
          return (
            <div key={field.id}>
              <div className="inline-block">
                <label className="label">裝備名稱</label>
                <input {...register(`equip_add.${index}.name` as const, { required: true })} type="text" disabled={readMode} className="input input-bordered w-full max-w-xs" />
              </div>
              <div className="inline-block">
                <label className="label">裝備數量／形容</label>
                <input {...register(`equip_add.${index}.des` as const, { required: true })} type="text" disabled={readMode} className="input input-bordered w-full max-w-xs" />
              </div>
              <button type="button" onClick={() => equipFields.remove(index)} className="btn btn-error btn-square inline-block">刪除</button>
            </div>
          )
        })}
      </div>
      <br />
      <div className="tooltip" data-tip="新增自訂一般裝備">
        <button type="button" onClick={() => { equipFields.append({ name: "", des: "" }) }} className="btn btn-outline">新增（一般）裝備</button>
      </div>
      <div className="divider"><h1>技術裝備</h1></div>
      <div className="form-control w-full max-w-s grid grid-cols-3">
        {techBaseList.map((value, index) => {
          return (
            <div key={value}>
              <label className="label">{value}</label>
              <input {...register(`techEquip.${index}.name`)} type="text" hidden={true} defaultValue={value} />
              <input {...register(`techEquip.${index}.des`)} type="text" placeholder="Type here" disabled={readMode} className="input input-bordered w-full max-w-xs" />
            </div>
          )
        })}
      </div>
      <div className="form-control w-full max-w-s grid grid-cols-3">
        {techEquipFields.fields.map((field, index) => {
          return (
            <div key={field.id}>
              <div className="inline-block">
                <label className="label">裝備名稱</label>
                <input {...register(`techEquip_add.${index}.name` as const, { required: true })} type="text" disabled={readMode} className="input input-bordered w-full max-w-xs" />
              </div>
              <div className="inline-block">
                <label className="label">裝備數量／形容</label>
                <input {...register(`techEquip_add.${index}.des` as const, { required: true })} type="text" disabled={readMode} className="input input-bordered w-full max-w-xs" />
              </div>
              <button type="button" onClick={() => techEquipFields.remove(index)} className="btn btn-error btn-square inline-block">刪除</button>
            </div>
          )
        })}
      </div>
      <br />
      <div className="tooltip" data-tip="新增自訂技術裝備">
        <button type="button" onClick={() => { techEquipFields.append({ name: "", des: "" }) }} className="btn btn-outline">新增技術裝備</button>
      </div>
      <br />
      <button type="submit" className="btn btn-outline btn-success">{!eventInfo && "新增隊伍"}{eventInfo && "更新基本隊伍資訊"}</button>
    </form>
  )
}