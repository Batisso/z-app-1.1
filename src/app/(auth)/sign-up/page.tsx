import { auth } from "@/lib/auth"; 
import { SignUpView } from "@/modules/auth/ui/views/sign-UP-view"
import { redirect } from "next/navigation";
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
        <SignUpView />
      </>;
}

export default Page;

// http://localhost:3000/sign-up