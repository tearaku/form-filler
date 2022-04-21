import { SubmitHandler, useForm } from "react-hook-form"
import { useRouter } from "next/router"

export default function EventRegister(props) {
  const router = useRouter()

  // const onSubmit: SubmitHandler<ProfileData> = async (data) => {
  //   const res = await fetch("/api/profile", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       userId: props.userId,
  //       formData: data,
  //     })
  //   });
  //   const res_data = await res.json();
  //   alert(res_data.message);
  //   if (res.ok) {
  //     alert("Profile update successful!")
  //     router.push("/");
  //   }
  // }

  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  return (
    <form>
      <h1>基本隊伍資訊</h1>
      <div className="form-control w-full max-w-s grid grid-cols-2">
        <div>
          <label className="label">隊伍名稱</label>
          <input {...register("title", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
          {errors.title && <p style={{ color: 'red' }}>請填寫隊伍名稱！</p>}
        </div>
        <div>
          <label className="label">活動地點</label>
          <input {...register("location", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
          {errors.location && <p style={{ color: 'red' }}>請填寫隊伍地點！</p>}
        </div>
        <div>
          <label className="label">開始日期</label>
          <input {...register("beginDate", { required: true })} type="date" className="input input-bordered w-full max-w-xs" />
          {errors.beginDate && <p style={{ color: 'red' }}>請填選開始日期！</p>}
        </div>
        <div>
          <label className="label">隊伍分級</label>
          <input {...register("category", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
          {errors.category && <p style={{ color: 'red' }}>請填寫隊伍分級！</p>}
        </div>
        <div>
          <label className="label">結束日期</label>
          <input {...register("endDate", { required: true })} type="date" className="input input-bordered w-full max-w-xs" />
          {errors.endDate && <p style={{ color: 'red' }}>請填選結束日期！</p>}
        </div>
        <div>
          <label className="label">隊伍分級</label>
          <input {...register("category", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
          {errors.category && <p style={{ color: 'red' }}>請填寫隊伍分級！</p>}
        </div>
        <div>
          <label className="label">群隊</label>
          <input {...register("groupCategory")} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
        </div>
        <div>
          <label className="label">包車</label>
          <input {...register("drivers")} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
        </div>
        <div>
          <label className="label">包車電話</label>
          <input {...register("driversNumber")} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
        </div>
        <div>
          <label className="label">無線電頻道</label>
          <input {...register("radioFreq", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
          {errors.radioFreq && <p style={{ color: 'red' }}>請填寫無線電頻道！</p>}
        </div>
        <div>
          <label className="label">無線電台號</label>
          <input {...register("radioCodename", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
        </div>
      </div>
      <div>
        <label className="label">行程</label>
        <textarea {...register("tripOverview", { required: true })} className="textarea textarea-bordered resize w-2/3" placeholder="Type here"></textarea>
      </div>
      <div>
        <label className="label">山難時間</label>
        <input {...register("rescueTime", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
        {errors.rescueTime && <p style={{ color: 'red' }}>請填寫山難時間！</p>}
      </div>
      <div>
        <label className="label">撤退計畫</label>
        <input {...register("retreatPlan")} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
      </div>
      <button type="submit" className="btn btn-outline btn-success">新增隊伍</button>
    </form>
  )
}