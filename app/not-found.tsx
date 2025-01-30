import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function NotFound() {
    const session = await getServerSession();

    if (session) {
        return redirect("/");
    }

    return redirect("/auth/sign-in")
}