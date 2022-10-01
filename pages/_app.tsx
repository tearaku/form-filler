import '../styles/globals.css'
import './styles.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import "core-js/stable/array/at"
import Script from 'next/script'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer />
      <Script src="node_modules/configurable-date-input-polyfill/configurable-date-input-polyfill.dist.js" />
      <SessionProvider session={pageProps.session} >
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}

export default MyApp
