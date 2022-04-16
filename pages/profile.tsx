import { useSession, getSession } from "next-auth/react"
import Layout from "../components/layout"
import type { NextPageContext } from "next"
import AccessDenied from "../components/access-denied"
import { SubmitHandler, useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { ProfileData } from "../components/user-profile-type"
import { useEffect } from "react"

export default function Profile() {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  useEffect(() => {
    console.log(session)
  })

  const router = useRouter()

  const onSubmit: SubmitHandler<ProfileData> = async (data) => {
    console.log("Submitted \n", data)

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session.user.id,
        formData: data,
      })
    });
    const res_data = await res.json();
    alert(res_data.message);
    if (res.ok) {
      alert("API res is ok!")
      router.push("/");
    }
  }

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProfileData>()
  const isStudent = watch("isStudent")
  const isTaiwanese = watch("isTaiwanese")

  return (
    <Layout>
      <h1>個人資料</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full max-w-xs">
          <label className="label">姓名</label>
          <input {...register("name", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
          {errors.name && <p style={{ color: 'red' }}>請填寫名子！</p>}

          <label className="label">生理性別</label>
          <select {...register("isMale", { required: true })} defaultValue={""} className="select select-bordered">
            <option disabled value="">...</option>
            <option value="true">男</option>
            <option value="false">女</option>
          </select>
          {errors.isMale && <p style={{ color: 'red' }}>請選擇性別！</p>}

          <label className="label">在校生</label>
          <select {...register("isStudent", { required: true })} defaultValue={""} className="select select-bordered">
            <option value="" disabled>...</option>
            <option value="true">是</option>
            <option value="false">否</option>
          </select>
          {errors.isStudent && <p style={{ color: 'red' }}>請選擇在校狀態！</p>}

          {(isStudent && isStudent.match("true")) && (
            <div>
              <label className="label">系級</label>
              <input {...register("majorYear", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              {errors.majorYear && <p style={{ color: 'red' }}>請填寫系級！</p>}
            </div>
          )}

          <label className="label">是否為台灣人？</label>
          <select {...register("isTaiwanese", { required: true })} defaultValue={""} className="select select-bordered">
            <option value="" disabled>...</option>
            <option value="true">是，有身分證字號</option>
            <option value="false">否</option>
          </select>
          {errors.isTaiwanese && <p style={{ color: 'red' }}>請選擇國籍狀態！</p>}

          {(isTaiwanese && isTaiwanese.match("true")) && (
            <div>
              <label className="label">身分證字號</label>
              <input {...register("nationalId", { required: true, pattern: /^([A-Za-z]){1}([\d]){9}$/ })} type="text" placeholder="例：A123456789" className="input input-bordered w-full max-w-xs" />
              {errors.nationalId && errors.nationalId.type === "required" && <p style={{ color: 'red' }}>請填寫身分證字號！</p>}
              {errors.nationalId && errors.nationalId.type === "pattern" && <p style={{ color: 'red' }}>請填寫合格的身分證字號格式！</p>}
            </div>
          )}
          {(isTaiwanese && isTaiwanese.match("false")) && (
            <div>
              <label className="label">英文名字</label>
              <input {...register("engName", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              {errors.engName && errors.engName.type === "required" && <p style={{ color: 'red' }}>請填寫英文名字！</p>}

              <label className="label">護照號碼</label>
              <input {...register("passportNumber", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              {errors.passportNumber && errors.passportNumber.type === "required" && <p style={{ color: 'red' }}>請填寫護照號碼！</p>}
            </div>
          )}

          <label className="label">出生日期</label>
          <input {...register("dateOfBirth", { required: true })} type="date" className="input input-bordered w-full max-w-xs" />
          {errors.dateOfBirth && errors.dateOfBirth.type === "required" && <p style={{ color: 'red' }}>請填選出生日期！</p>}

          <label className="label">
            出生地
            <span className="label-text-alt">國內請填縣市，國外請填國家</span>
          </label>
          <input {...register("placeOfBirth", { required: true })} type="text" className="input input-bordered w-full max-w-xs" />
          {errors.placeOfBirth && errors.placeOfBirth.type === "required" && <p style={{ color: 'red' }}>請填寫出生地！</p>}

          <label className="label">住址</label>
          <input {...register("address", { required: true })} type="text" className="input input-bordered w-full max-w-xs" />
          {errors.address && errors.address.type === "required" && <p style={{ color: 'red' }}>請填寫住址！</p>}

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

          <label className="label">緊急聯絡人姓名</label>
          <input {...register("emergencyContactName", { required: true })} type="text" className="input input-bordered w-full max-w-xs" />
          {errors.emergencyContactName && errors.emergencyContactName.type === "required" && <p style={{ color: 'red' }}>請填寫緊急聯絡人姓名！</p>}

          <label className="label">
            緊急聯絡人手機
            <span className="label-text-alt">例：0912-345-678</span>
          </label>
          <input {...register("emergencyContactMobile", { required: true, pattern: /^([\d]{4})-([\d]{3})-([\d]{3})$/ })} type="text" className="input input-bordered w-full max-w-xs" />
          {errors.emergencyContactMobile && errors.emergencyContactMobile.type === "required" && <p style={{ color: 'red' }}>請填寫緊急聯絡人手機！</p>}
          {errors.emergencyContactMobile && errors.emergencyContactMobile.type === "pattern" && <p style={{ color: 'red' }}>行動電話：格式不合法</p>}

          <label className="label">
            緊急聯絡人市話
            <span className="label-text-alt">例：02-12345678</span>
          </label>
          <input {...register("emergencyContactPhone", { required: true, pattern: /^([\d]{2})-([\d]{1,})|(無)$/ })} type="text" placeholder="例：02-12345678、或是：無" className="input input-bordered w-full max-w-xs" />
          {errors.emergencyContactPhone && errors.emergencyContactPhone.type === "required" && <p style={{ color: 'red' }}>請填寫緊急聯絡人室話！<br />若沒有，請填寫「無」一字</p>}
          {errors.emergencyContactPhone && errors.emergencyContactPhone.type === "pattern" && <p style={{ color: 'red' }}>室話：格式不合法</p>}

          <label className="label">保險受益人</label>
          <input {...register("beneficiaryName", { required: true })} type="text" className="input input-bordered w-full max-w-xs" />
          {errors.beneficiaryName && errors.beneficiaryName.type === "required" && <p style={{ color: 'red' }}>請填寫保險受益人姓名！</p>}

          <label className="label">保險受益人關係</label>
          <input {...register("beneficiaryRelation", { required: true })} type="text" className="input input-bordered w-full max-w-xs" />
          {errors.beneficiaryRelation && errors.beneficiaryRelation.type === "required" && <p style={{ color: 'red' }}>請填寫保險受益人關係！</p>}

          <label className="label">
            飯量幾兩
            <span className="label-text-alt">一般為：男4兩、女2兩</span>
          </label>
          <input {...register("riceAmount", { required: true })} type="number" min={0} max={10} step={0.5} className="input input-bordered w-full max-w-xs" />
          {errors.riceAmount && errors.riceAmount.type === "required" && <p style={{ color: 'red' }}>請填寫飯量！</p>}

          <label className="label">
            特別不吃或特別想吃？
            <span className="label-text-alt">有過敏之類的麻煩細寫</span>
          </label>
          <input {...register("foodPreference")} type="text" className="input input-bordered w-full max-w-xs" />

          <br />
          <button type="submit" className="btn btn-outline btn-success">更新個人資訊</button>
        </div>
        <div className="form-control w-fit"></div>
      </form>
    </Layout>
  )
}

// Export the `session` prop to use sessions with Server Side Rendering
export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      session: await getSession(context),
    },
  }
}