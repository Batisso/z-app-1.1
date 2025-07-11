import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ThemeToggle } from "@/components/ThemeToggle";


const Page = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!!session) {
        redirect("/");
    }


    return <>
      <ThemeToggle />
      <SignInView />
    </>
}

export default Page;
// http://localhost:3000/sign-in