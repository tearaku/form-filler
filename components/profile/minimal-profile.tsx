import { SubmitHandler, useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { MinimalProfileData } from "../user-profile-type"
import useSWR from "swr"

export default function MinimalProfile(props) {
  const router = useRouter()
  const onSubmit: SubmitHandler<MinimalProfileData> = async (data) => {
    const res = await fetch(`/api/minProfile/${props.userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formData: data,
      })
    });
    const res_data = await res.json();
    alert(res_data.message);
    if (res.ok) {
      alert("Minimal profile update successful!")
      router.push("/");
    }
  }

  const fetcher = url => fetch(url).then(res => res.json())
  const { data, error } = useSWR(`/api/minProfile/${props.userId}`, fetcher)

  const { register, handleSubmit, formState: { errors } } = data ? useForm<MinimalProfileData>({
      defaultValues: {
        name: data.name,
        mobileNumber: data.mobileNumber,
        phoneNumber: data.phoneNumber,
      }
    }) : useForm<MinimalProfileData>()

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full max-w-xs">
          <label className="label">姓名</label>
          <input {...register("name", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
          {errors.name && <p style={{ color: 'red' }}>請填寫名子！</p>}

          <label className="label">
            行動電話
            <span className="label-text-alt">例：0912-345-678</span>
          </label>
          <input {...register("mobileNumber", { required: true, pattern: /^([\d]{4})-([\d]{3})-([\d]{3})$/ })} type="text" placeholder="例：0912-345-678" className="input input-bordered w-full max-w-xs" />
          {errors.mobileNumber && errors.mobileNumber.type === "required" && <p style={{ color: 'red' }}>請填寫行動電話！</p>}
          {errors.mobileNumber && errors.mobileNumber.type === "pattern" && <p style={{ color: 'red' }}>行動電話：格式不合法</p>}

          <label className="label">
            市內電話
            <span className="label-text-alt">例：02-12345678</span>
          </label>
          <input {...register("phoneNumber", { required: true, pattern: /^([\d]{2})-([\d]{1,})|(無)$/ })} type="text" placeholder="例：02-12345678、或是：無" className="input input-bordered w-full max-w-xs" />
          {errors.phoneNumber && errors.phoneNumber.type === "required" && <p style={{ color: 'red' }}>請填寫室內電話！<br />若沒有，請填寫「無」一字</p>}
          {errors.phoneNumber && errors.phoneNumber.type === "pattern" && <p style={{ color: 'red' }}>室內電話：格式不合法</p>}

          <br />
          <button type="submit" className="btn btn-outline btn-success">更新簡短個人資訊</button>
        </div>
        <div className="form-control w-fit"></div>
      </form>
    </div>
  )
}