//usuario de base de datos
export interface UserInterface {
    id: string;
    email: string;
}

export interface NextAuthToken {
    email: string;
    picture: string;
    sub: string;
    role: string;
    id: string;
    iat: number;
    exp: number;
    jti: string;
}