import { signIn } from "next-auth/react"

export default function AccessDenied() {
  return (
    <>
      <h1>Access Denied</h1>
      <p>
        <a
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault()
            signIn()
          }}
        >
          You must be signed in to view this page
        </a><br />
        Please <b className="text-rose-500">do not</b> use embedded browsers to login if you're on mobile, please open it in any browser of your choice! <br />
        使用手機者：<b className="text-rose-500">請勿</b>直接在APP裡面打開登入（沒有跳離APP即是在APP裡），請將其另外開在遊覽器<br />
        （ <span className="material-icons">&#xe6b8;</span> Open in Safari / Chrome / etc.)

      </p>
    </>
  )
}
