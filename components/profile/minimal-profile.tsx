import { SubmitHandler, useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { MinimalProfileData } from "./user-profile-type"
import { useState } from "react"
import { toast } from "react-toastify"
import { MinimalProfile } from "@prisma/client"
import { useSession } from "next-auth/react"

interface PropType {
  userData: MinimalProfile
  readOnly: boolean
}

export default function MinimalProfileForm({ userData, readOnly }: PropType) {
  const router = useRouter()
  const { data: session } = useSession()
  const [waitSubmit, setWaitSubmit] = useState(false)

  const onSubmit: SubmitHandler<MinimalProfileData> = async (data) => {
    setWaitSubmit(true);
    const submitPromise = fetch(`/api/minProfile/${session.user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formData: data,
        method: "UPDATE",
      })
    });
    const res = await toast.promise(
      submitPromise,
      {
        pending: {
          render() {
            return "Submitting data..."
          },
          icon: false,
        },
        error: {
          render() {
            return "There's an error in submitting your data, please try again"
          },
        },
      }
    )
    const res_data = await res.json();
    setWaitSubmit(false);
    if (res.ok) {
      toast.success(res_data.message);
      router.push("/");
    } else {
      toast.error("Error in updating minimal profile: \n" + res_data.message);
    }
  }

  const { register, handleSubmit, formState: { errors } } = userData ? useForm<MinimalProfileData>({
    defaultValues: {
      name: userData.name,
      mobileNumber: userData.mobileNumber,
      phoneNumber: userData.phoneNumber,
    }
  }) : useForm<MinimalProfileData>()

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full max-w-xs">
          <label className="label">姓名</label>
          <input {...register("name", { required: true })} disabled={readOnly} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
          {errors.name && <p style={{ color: 'red' }}>請填寫名子！</p>}

          <label className="label">
            行動電話
            <span className="label-text-alt">例：0912-345-678</span>
          </label>
          <input {...register("mobileNumber", { required: true, pattern: /^([\d]{4})-([\d]{3})-([\d]{3})$/ })} disabled={readOnly} type="text" placeholder="例：0912-345-678" className="input input-bordered w-full max-w-xs" />
          {errors.mobileNumber && errors.mobileNumber.type === "required" && <p style={{ color: 'red' }}>請填寫行動電話！</p>}
          {errors.mobileNumber && errors.mobileNumber.type === "pattern" && <p style={{ color: 'red' }}>行動電話：格式不合法</p>}

          <label className="label">
            市內電話
            <span className="label-text-alt">例：02-12345678</span>
          </label>
          <input {...register("phoneNumber", { required: true, pattern: /^([\d]{2})-([\d]{1,})|(無)$/ })} disabled={readOnly} type="text" placeholder="例：02-12345678、或是：無" className="input input-bordered w-full max-w-xs" />
          {errors.phoneNumber && errors.phoneNumber.type === "required" && <p style={{ color: 'red' }}>請填寫室內電話！<br />若沒有，請填寫「無」一字</p>}
          {errors.phoneNumber && errors.phoneNumber.type === "pattern" && <p style={{ color: 'red' }}>室內電話：格式不合法</p>}

          <br />
          {!readOnly &&
            <button type="submit" className="btn btn-outline btn-success">
              更新簡短個人資訊
              {waitSubmit &&
                <progress className="progress w-50"></progress>}
            </button>}
        </div>
        <div className="form-control w-fit"></div>
      </form>
    </div>
  )
}
