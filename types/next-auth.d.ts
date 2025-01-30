import NextAuth, { DefaultSession, DefaultUser, ISODateString } from "next-auth";

declare module "next-auth" {

    /* Extender los tipos del usuario. */
    interface User extends DefaultUser {
        id?: string | null;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        // role?: string;
    }

    /* Extender los tipos del sesión. */
    interface Session extends DefaultSession {
        user: {
            name?: string | null
            email?: string | null
            image?: string | null
        }
        expires: ISODateString
    }
}

/* Extender los tipos del JWT. */
declare module "next-auth/jwt" {
    interface JWT {
        id?: string | null;
        // role?: string;
    }
}