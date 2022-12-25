import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../utils/prisma"

// Using unstable_getServerSession in API routes / serverSideProps is faster,
// or so the doc claims XDD
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
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
    signIn: '/auth/signIn',
  },
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.user.id = user.id
      return session
    }
  },
  events: {
    createUser: async ({ user }) => {
      await prisma.minimalProfile.create({
        data: {
          userId: parseInt(user.id),
          name: "",
          mobileNumber: "",
        }
      })
    },
  },
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth(authOptions)
