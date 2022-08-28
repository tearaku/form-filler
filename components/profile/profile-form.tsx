import { SubmitHandler, useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { MinimalProfileData, ProfileData } from "./user-profile-type"
import { useState } from "react"
import { toast } from "react-toastify"

interface PropType {
  userData: {
    hasFullProfile: boolean
    profile: ProfileData
    minProfile: MinimalProfileData
  }
  readOnly: boolean
}

export default function UserProfileForm({ userData, readOnly }: PropType) {
  const router = useRouter()
  const [waitSubmit, setWaitSubmit] = useState(false)

  const onSubmit: SubmitHandler<ProfileData> = async (data) => {
    setWaitSubmit(true);
    const submitPromise = fetch(`/api/profile/${userData.profile.userId}`, {
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
      toast.error(res_data.message);
    }
  }

  const { register, handleSubmit, watch, formState: { errors } } = userData.hasFullProfile ?
    useForm<ProfileData>({
      defaultValues: {
        ...userData.profile,
        ...userData.minProfile,
        riceAmount: (userData.profile.riceAmount),
      }
    })
    : useForm<ProfileData>()

  const isStudent = watch("isStudent")
  const isTaiwanese = watch("isTaiwanese")

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-control w-full max-w-xs">
        <label className="label">姓名</label>
        <input {...register("name", { required: true })} disabled={readOnly} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
        {errors.name && <p style={{ color: 'red' }}>請填寫名子！</p>}

        <label className="label">生理性別</label>
        <select {...register("isMale", { required: true })} defaultValue={""} disabled={readOnly} className="select select-bordered">
          <option disabled value="">...</option>
          <option value="true">男</option>
          <option value="false">女</option>
        </select>
        {errors.isMale && <p style={{ color: 'red' }}>請選擇性別！</p>}

        <label className="label">在校生</label>
        <select {...register("isStudent", { required: true })} defaultValue={""} disabled={readOnly} className="select select-bordered">
          <option value="" disabled>...</option>
          <option value="true">是</option>
          <option value="false">否</option>
        </select>
        {errors.isStudent && <p style={{ color: 'red' }}>請選擇在校狀態！</p>}

        {(isStudent && isStudent.match("true")) && (
          <div>
            <label className="label">系級</label>
            <input {...register("majorYear", { required: true })} disabled={readOnly} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            {errors.majorYear && <p style={{ color: 'red' }}>請填寫系級！</p>}
          </div>
        )}

        <label className="label">有無台灣身分證字號？</label>
        <select {...register("isTaiwanese", { required: true })} defaultValue={""} disabled={readOnly} className="select select-bordered">
          <option value="" disabled>...</option>
          <option value="true">是，有身分證字號</option>
          <option value="false">否</option>
        </select>
        {errors.isTaiwanese && <p style={{ color: 'red' }}>請選擇國籍狀態！</p>}

        {(isTaiwanese && isTaiwanese.match("true")) && (
          <div>
            <label className="label">身分證字號</label>
            <input {...register("nationalId", { required: true, pattern: /^([A-Za-z]){1}([\d]){9}$/ })} disabled={readOnly} type="text" placeholder="例：A123456789" className="input input-bordered w-full max-w-xs" />
            {errors.nationalId && errors.nationalId.type === "required" && <p style={{ color: 'red' }}>請填寫身分證字號！</p>}
            {errors.nationalId && errors.nationalId.type === "pattern" && <p style={{ color: 'red' }}>請填寫合格的身分證字號格式！</p>}
          </div>
        )}
        {(isTaiwanese && isTaiwanese.match("false")) && (
          <div>
            <label className="label">英文名字</label>
            <input {...register("engName", { required: true })} type="text" disabled={readOnly} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            {errors.engName && errors.engName.type === "required" && <p style={{ color: 'red' }}>請填寫英文名字！</p>}

            <label className="label">護照號碼</label>
            <input {...register("passportNumber", { required: true })} type="text" disabled={readOnly} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            {errors.passportNumber && errors.passportNumber.type === "required" && <p style={{ color: 'red' }}>請填寫護照號碼！</p>}

            <label className="label">國籍</label>
            <input {...register("nationality", { required: true })} type="text" disabled={readOnly} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            {errors.nationality && errors.nationality.type === "required" && <p style={{ color: 'red' }}>請填寫國籍！</p>}
          </div>
        )}

        <label className="label">出生日期</label>
        <input {...register("dateOfBirth", { required: true })} type="date" disabled={readOnly} className="input input-bordered w-full max-w-xs" />
        {errors.dateOfBirth && errors.dateOfBirth.type === "required" && <p style={{ color: 'red' }}>請填選出生日期！</p>}

        <label className="label">
          出生地
          <span className="label-text-alt">國內請填縣市，國外請填國家</span>
        </label>
        <input {...register("placeOfBirth", { required: true })} type="text" disabled={readOnly} className="input input-bordered w-full max-w-xs" />
        {errors.placeOfBirth && errors.placeOfBirth.type === "required" && <p style={{ color: 'red' }}>請填寫出生地！</p>}

        <label className="label">住址</label>
        <input {...register("address", { required: true })} type="text" disabled={readOnly} className="input input-bordered w-full max-w-xs" />
        {errors.address && errors.address.type === "required" && <p style={{ color: 'red' }}>請填寫住址！</p>}

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

        <label className="label">緊急聯絡人姓名</label>
        <input {...register("emergencyContactName", { required: true })} disabled={readOnly} type="text" className="input input-bordered w-full max-w-xs" />
        {errors.emergencyContactName && errors.emergencyContactName.type === "required" && <p style={{ color: 'red' }}>請填寫緊急聯絡人姓名！</p>}

        <label className="label">
          緊急聯絡人手機
          <span className="label-text-alt">例：0912-345-678</span>
        </label>
        <input {...register("emergencyContactMobile", { required: true, pattern: /^([\d]{4})-([\d]{3})-([\d]{3})$/ })} disabled={readOnly} type="text" className="input input-bordered w-full max-w-xs" />
        {errors.emergencyContactMobile && errors.emergencyContactMobile.type === "required" && <p style={{ color: 'red' }}>請填寫緊急聯絡人手機！</p>}
        {errors.emergencyContactMobile && errors.emergencyContactMobile.type === "pattern" && <p style={{ color: 'red' }}>行動電話：格式不合法</p>}

        <label className="label">
          緊急聯絡人市話
          <span className="label-text-alt">例：02-12345678</span>
        </label>
        <input {...register("emergencyContactPhone", { required: true, pattern: /^([\d]{2})-([\d]{1,})|(無)$/ })} disabled={readOnly} type="text" placeholder="例：02-12345678、或是：無" className="input input-bordered w-full max-w-xs" />
        {errors.emergencyContactPhone && errors.emergencyContactPhone.type === "required" && <p style={{ color: 'red' }}>請填寫緊急聯絡人室話！<br />若沒有，請填寫「無」一字</p>}
        {errors.emergencyContactPhone && errors.emergencyContactPhone.type === "pattern" && <p style={{ color: 'red' }}>室話：格式不合法</p>}

        <label className="label">保險受益人</label>
        <input {...register("beneficiaryName", { required: true })} disabled={readOnly} type="text" className="input input-bordered w-full max-w-xs" />
        {errors.beneficiaryName && errors.beneficiaryName.type === "required" && <p style={{ color: 'red' }}>請填寫保險受益人姓名！</p>}

        <label className="label">保險受益人關係</label>
        <input {...register("beneficiaryRelation", { required: true })} disabled={readOnly} type="text" className="input input-bordered w-full max-w-xs" />
        {errors.beneficiaryRelation && errors.beneficiaryRelation.type === "required" && <p style={{ color: 'red' }}>請填寫保險受益人關係！</p>}

        <label className="label">
          飯量幾兩
          <span className="label-text-alt">一般為：男4兩、女2兩</span>
        </label>
        <input {...register("riceAmount", { required: true })} type="number" min={0} max={10} step={0.5} disabled={readOnly} className="input input-bordered w-full max-w-xs" />
        {errors.riceAmount && errors.riceAmount.type === "required" && <p style={{ color: 'red' }}>請填寫飯量！</p>}

        <label className="label">
          特別不吃或特別想吃？
          <span className="label-text-alt">有過敏之類的麻煩細寫</span>
        </label>
        <input {...register("foodPreference")} disabled={readOnly} type="text" className="input input-bordered w-full max-w-xs" />

        <br />
        {!readOnly &&
          <button type="submit" className="btn btn-outline btn-success">
            更新個人資訊
            {waitSubmit &&
              <progress className="progress w-50"></progress>}
          </button>}
      </div>
      <div className="form-control w-fit"></div>
    </form>
  )
}
