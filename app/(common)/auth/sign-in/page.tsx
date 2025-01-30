import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginPageClient from "./page.client";

export default async function LoginPage() {
    const session = await getServerSession();

    if (session) { return redirect("/") }

    return <LoginPageClient />
}