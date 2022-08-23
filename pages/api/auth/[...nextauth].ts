import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../utils/prisma"

// Using unstable_getServerSession in API routes / serverSideProps is faster,
// or so the doc claims XDD
export const authOptions: NextAuthOptions = {
  providers: [
    /*
    FacebookProvider({
      clientId: process.env.NODE_ENV === "production" ? (process.env.FACEBOOK_ID as string) : (process.env.FACEBOOK_ID_DEV as string),
      clientSecret: process.env.NODE_ENV === "production" ? (process.env.FACEBOOK_SECRET as string) : (process.env.FACEBOOK_SECRET_DEV as string),
    }),
    */
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  pages: {
    newUser: '/profile',
  },
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      const userData = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        }
      })
      session.user.id = userData.id
      return session
    }
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth(authOptions)
