import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "./header.module.css"

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  return (
    <header>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${!session && loading ? styles.loading : styles.loaded
            }`}
        >
          {!session && (
            <>
              <span className={styles.notSignedInText}>
                You are not signed in
              </span>
              <div className={styles.buttonPrimary}>
                <a
                  href={`/api/auth/signin`}
                  onClick={(e) => {
                    e.preventDefault()
                    signIn()
                  }}
                >
                  <span className="material-icons">&#xea77;</span>
                  登入
                </a>
              </div>
            </>
          )}
          {session?.user && (
            <>
              {session.user.image && (
                <span
                  style={{ backgroundImage: `url('${session.user.image}')` }}
                  className={styles.avatar}
                />
              )}
              <span className={styles.signedInText}>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.name ?? session.user.email}</strong>
              </span>
              <div className={styles.button}>
                <a
                  href={`/api/auth/signout`}
                  onClick={(e) => {
                    e.preventDefault()
                    signOut()
                  }}
                >
                  <span className="material-icons">&#xe9ba;</span>
                  登出
                </a>
              </div>
            </>
          )}
        </p>
      </div>
      <nav>
        <ul className={styles.navItems}>
          <span className="material-icons">&#xe88a;</span>
          <li className={styles.navItem}>
            <Link href="/">
              <a>首頁 | Home</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <span className="material-icons">&#xe853;</span>
            <Link href="/profile">
              <a>個人資料 | Profile</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <span className="material-icons">&#xe50a;</span>
            <Link href="/event">
              <a>隊伍清單 | Events</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <span className="material-icons">&#xf233;</span>
            <Link href="/committee">
              <a>幹部清單 | Committee</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}