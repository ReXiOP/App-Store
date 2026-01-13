"use client";

import Link from "next/link";
import { Search, Menu, ShoppingBag, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { useSession, signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            router.push(`/apps?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
                        <div className="bg-primary/10 p-2 squircle group-hover:bg-primary/20 transition-colors">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                        </div>
                        <span>AppStore</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href="/apps" className="text-sm font-medium hover:text-primary transition-colors">
                            Discover Apps
                        </Link>
                    </div>

                    {/* Search & Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="relative w-64 group">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search apps..."
                                className="pl-9 bg-muted/50 border-transparent focus:bg-background focus:border-input transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                        <ModeToggle />

                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 squircle ring-2 ring-transparent hover:ring-primary/20 transition-all overflow-hidden p-0">
                                        <div className="h-9 w-9 squircle overflow-hidden">
                                            <Avatar className="h-9 w-9 rounded-none">
                                                <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                                                <AvatarFallback className="bg-primary/10 text-primary">{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                                            <p className="text-[10px] text-blue-500 font-mono mt-1">Role: {session.user?.role || "NONE"}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {session.user?.role === "ADMIN" && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin" className="cursor-pointer">
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <Link href="/profile">
                                        <DropdownMenuItem className="cursor-pointer">
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-500 focus:text-red-500">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/auth/signin">
                                    <Button variant="ghost" size="sm">Log in</Button>
                                </Link>
                                <Link href="/auth/signin">
                                    <Button size="sm">Sign up</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden flex items-center gap-4">
                        {session && (
                            <Link href="/profile">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={session.user?.image || ""} />
                                    <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </Link>
                        )}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle className="flex items-center gap-2">
                                        <ShoppingBag className="h-5 w-5 text-primary" />
                                        AppStore
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-4 mt-8">
                                    <Link href="/" className="text-lg font-medium">
                                        Home
                                    </Link>
                                    <Link href="/apps" className="text-lg font-medium">
                                        Apps
                                    </Link>
                                    {session ? (
                                        <Button variant="destructive" onClick={() => signOut()} className="mt-4 w-full">
                                            Log Out
                                        </Button>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            <Link href="/auth/signin">
                                                <Button variant="outline" className="w-full">Log In</Button>
                                            </Link>
                                            <Link href="/auth/signin">
                                                <Button className="w-full">Sign Up</Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
