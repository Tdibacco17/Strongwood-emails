'use server';
import { getToken } from "next-auth/jwt";
import { cookies } from 'next/headers';
// import { compare } from "./bcrypt";
import { NextAuthToken } from "@/types/SessionTypes";

export async function getSessionToken(): Promise<NextAuthToken | null> {
    try {
        const isProduction = process.env.NODE_ENV === 'production';

        const cookieName = isProduction
            ? '__Secure-next-auth.session-token'
            : 'next-auth.session-token';

        const session = await getToken({
            req: {
                cookies: {
                    [cookieName]: (await cookies()).get(cookieName)?.value
                }
            } as any,
            secret: process.env.NEXTAUTH_SECRET as string
        }) as NextAuthToken | null;

        if (!session) {
            return null;
        }
        // if (!(await compare(process.env.ACCESS_TOKEN, session?.accessToken))) {
        //     return null;
        // }

        return session;
    } catch (error) {
        console.error("Failed to get session: ", error);
        return null;
    }
}
