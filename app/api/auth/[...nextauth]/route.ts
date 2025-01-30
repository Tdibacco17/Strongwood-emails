import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { UserInterface } from "@/types/SessionTypes";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "m@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // console.log(credentials)
                try {
                    if (!credentials?.email || !credentials?.password) return null;

                    if (credentials?.email !== process.env.SESSION_EMAIL) return null
                    if (credentials?.password !== process.env.SESSION_PASSWORD) return null

                    //usuario de base de datos
                    const user: UserInterface = {
                        id: '1',
                        email: process.env.SESSION_EMAIL,
                    };

                    return user;

                } catch (error) {
                    console.error("Error in authorize function:", error);
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // if (user) {
            //     token.id = user.id;
            // }
            return token;
        },
        async session({ session }) {
            return session;
        },
    },
    pages: {
        signIn: '/auth/sign-in'
    },
    secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }