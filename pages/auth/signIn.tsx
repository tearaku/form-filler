import { getProviders, signIn, useSession, ClientSafeProvider } from "next-auth/react"
import { authOptions } from "../api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import type { GetServerSideProps } from "next"
import Head from 'next/head'

import Layout from "../../components/layout"

export default function SignIn({ providers }) {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  if (loading) return <Layout><h1>Loading...</h1></Layout>
  if (session) return <Layout><h1>You are already logged in!</h1></Layout>

  return (
    <Layout>
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <Head>
          <title>公文產生機：登入</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <div className="card">
            <h1 className="text-5xl font-bold">公文產生器</h1>
            <div className="divider"></div>
            <h1 className="text-4xl font-bold">登入選項</h1>
            <h1 className="text-4xl font-bold">Log In Options</h1>
            <br />
            {providers &&
              Object.values(providers).map((provider: ClientSafeProvider) => (
                <div key={provider.name}>
                  <button className="btn btn-wide" onClick={() => signIn(provider.id, { callbackUrl: '/' })}>
                    Continue with{' '} {provider.name}
                  </button>
                </div>
              ))}
          </div>
        </main>
      </div>
    </Layout>
  )
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  const providers = await getProviders();
  return {
    props: { providers: providers, session: session },
  }
}
