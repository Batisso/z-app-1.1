"use client";

import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaGoogle} from "react-icons/fa";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";


import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { set } from "date-fns";
import { auth } from "@/lib/auth";





const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }),
});


export const SignInView = () => {
   

    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null); // Reset error state
        setPending(true); // Set pending state to true 


          authClient.signIn.email(
            {
                email: data.email,
                password: data.password,
                callbackURL: "/",
            },
            {
                onSuccess: () => {
                    setPending(false);
                    router.push("/"); // Reset pending state
                },
                onError: ({error}) => {
                    setPending(false); // Reset pending state
                    setError(error.message);
                }, 
            }
        );
            
    };


      const onSocial = (provider: "google") => {
        setError(null); // Reset error state
        setPending(true); // Set pending state to true
    
    
        authClient.signIn.social(
          {
            provider: provider,
            callbackURL: "/"
          },
          {
            onSuccess: () => {
              setPending(false); // Reset pending state
            },
            onError: ({ error }) => {
              setPending(false); // Reset pending state
              setError(error.message);
            },
          }
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">
                                        Welcome!
                                    </h1>
                                    <p className="text-muted-foreground text-balance">
                                        Login To Your Zadulis Account
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="batisso@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Enter your password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {!!error && (
                                    <Alert className="bg-destructive/10 text-destructive-foreground border-none">
                                        <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                                        <AlertTitle className="font-semibold">
                                            {error}
                                        </AlertTitle>
                                    </Alert>
                                )}
                                <Button
                                    disabled={pending}
                                    type="submit"
                                    className="w-full bg-black hover:bg-orange-400 text-white"
                                >
                                    Sign In
                                </Button>
                                <div className="after:border-border relative text-center text-sm after:absolute 
                                after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        Or continue with
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2 md:flex-row">
                                    <Button
                                        disabled={pending}
                                        onClick={() => onSocial("google")}
                                        variant="outline"
                                        type="button"
                                        className="w-full bg-white hover:bg-gray-200">
                                        <FaGoogle />
                                        Google
                                    </Button>
                                </div>
                                <div className="text-center text-sm text-muted-foreground">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/sign-up" className="text-blue-500 hover:underline">Sign Up</Link>

                                </div>
                            </div>
                        </form>
                    </Form>

                    <div className="bg-radial from-red-700 to-red-900 relative hidden md:flex 
            flex-col gap-y-4 items-center justify-center">
                        <img src="/logo.svg" alt="Zadulis Logo" className="h-[192px] w-[192px]" />
                        <p className="text-4xl font-extrabold text-white ">
                            ZADULIS
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs
            text-balance *:[a]:underline *:[a]:underline-offset-4" >
                By signing in, you agree to our{" "}
                <a href="#" className=" hover:underline">
                    Terms of Service
                </a> and{" "}
                <a href="#" className=" hover:underline">
                    Privacy Policy
                </a>
            </div>
        </div>
    );
}