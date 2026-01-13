"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { registerUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function SignInPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Login Handler
    const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.ok) {
            router.push("/");
            router.refresh();
        } else {
            alert("Invalid credentials");
            setIsLoading(false);
        }
    };

    // Register Handler
    const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            await registerUser(formData);
            // Auto login after register
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            await signIn("credentials", { email, password, callbackUrl: "/" });
        } catch (error) {
            alert("Registration failed. Email might be taken.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Marketing / Visuals */}
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
                <div className="relative z-10 flex items-center gap-2 font-bold text-2xl">
                    <ShoppingBag className="h-8 w-8" />
                    <span>AppStore Pro</span>
                </div>
                <div className="relative z-10 space-y-4">
                    <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                        Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Next Gen</span> <br />
                        of Applications.
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-md">
                        Join our exclusive community of developers and users. Download premium apps, verify security, and manage your updates in one place.
                    </p>
                </div>
                <div className="relative z-10 text-sm text-zinc-500">
                    &copy; 2024 AppStore Inc. All rights reserved.
                </div>
            </div>

            {/* Right: Auth Form */}
            <div className="flex items-center justify-center p-4 bg-background">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                        <p className="text-muted-foreground mt-2">
                            Enter your details to access your account.
                        </p>
                    </div>

                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Create Account</TabsTrigger>
                        </TabsList>

                        {/* Login Tab */}
                        <TabsContent value="login">
                            <Card>
                                <form onSubmit={onSignIn}>
                                    <CardHeader>
                                        <CardTitle>Sign In</CardTitle>
                                        <CardDescription>Access your dashboard and apps.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password">Password</Label>
                                                <a href="#" className="text-sm text-primary hover:underline">Forgot?</a>
                                            </div>
                                            <Input id="password" name="password" type="password" required />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-4">
                                        <Button className="w-full" type="submit" disabled={isLoading}>
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Sign In with Email
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </TabsContent>

                        {/* Register Tab */}
                        <TabsContent value="register">
                            <Card>
                                <form onSubmit={onRegister}>
                                    <CardHeader>
                                        <CardTitle>Create Account</CardTitle>
                                        <CardDescription>Start downloading apps today.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="reg-name">Full Name</Label>
                                            <Input id="reg-name" name="name" placeholder="John Doe" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="reg-email">Email</Label>
                                            <Input id="reg-email" name="email" type="email" placeholder="m@example.com" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="reg-password">Password</Label>
                                            <Input id="reg-password" name="password" type="password" required />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-4">
                                        <Button className="w-full" type="submit" disabled={isLoading}>
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Create Account
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all rounded-xl" onClick={() => window.location.href = "https://oauth.sm40.com/?action=login"} disabled={isLoading}>
                            <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold">40</div>
                            SM40
                        </Button>
                        <Button variant="outline" className="w-full gap-2 rounded-xl" onClick={() => signIn("google", { callbackUrl: "/" })} disabled={isLoading}>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Google
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
