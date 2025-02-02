'use client'
import { EyeNoneIcon, EyeOpenIcon, SpinIcon } from "@/components/Icons/Icons";
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPageClient() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<null | string>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            setErrorMessage('Credenciales invalidas');
            setTimeout(() => {
                setErrorMessage(null);
            }, 4000)
            return
        }
        setLoading(true);

        const response = await signIn('credentials', {
            email: email,
            password: password,
            redirect: false,
            // callbackUrl: '/'
        })
        if (!response?.ok || response?.status === 401) {
            setErrorMessage('Credenciales invalidas');
            setLoading(false);
            setTimeout(() => {
                setErrorMessage(null);
            }, 4000)
        } else {
            setTimeout(() => {
                router.push('/')
                return () => { setLoading(false); }
            }, 2000);
        }
    }

    return (
        <div className="h-full flex justify-center items-center p-8">
            <div className="flex flex-col items-center gap-6 min-w-80">
                <div>
                    <p className="text-2xl font-semibold leading-7 tracking-tight text-center font-geistSans">Bienvenido!</p>
                    <p className="text-sm text-center text-muted mt-1.5 font-geistSans">Por favor inicia sesión para continuar</p>
                </div>
                <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div className="space-y-2 w-full">
                        <div className="flex flex-col space-y-1.5">
                            <label htmlFor="login-email" className="text-sm font-medium font-geistSans">Email</label>
                            <input
                                className="w-full h-9 bg-transparent border-[1px] outline-1 text-cotton font-geistSans border-muted py-2 px-3 rounded-md text-sm placeholder:text-muted"
                                id="login-email"
                                name="email"
                                placeholder="m@example.com"
                                type="email"
                            />
                        </div>
                    </div>
                    <div className="space-y-2 w-full">
                        <div className="flex flex-col space-y-1.5">
                            <label htmlFor="login-password" className="text-sm font-medium font-geistSans">Contraseña</label>
                            <div className="relative w-full">
                                <input
                                    className="w-full h-9 bg-transparent border-[1px] text-cotton font-geistSans border-muted py-2 px-3 rounded-md text-sm placeholder:text-muted"
                                    id="login-password"
                                    name="password"
                                    placeholder="********"
                                    type={showPassword ? "text" : "password"}
                                />
                                <div
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5 cursor-pointer">
                                    {showPassword ? <EyeOpenIcon /> : <EyeNoneIcon />}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            className="disabled:hover:bg-light disabled:cursor-not-allowed disabled:opacity-50 w-full bg-light text-dark font-geistSans text-sm rounded-md h-9 flex justify-center items-center hover:bg-lightHover"
                            disabled={loading}
                            type="submit"
                        >
                            {loading ? <SpinIcon /> : 'Continuar'}
                        </button>
                        {errorMessage &&
                            <small className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-geistSans text-sm text-warning whitespace-nowrap font-normal text-center">
                                {errorMessage}
                            </small>}
                    </div>
                </form>

            </div>
        </div>
    );
}
