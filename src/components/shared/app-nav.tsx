"use client";

import * as React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Plus, LayoutDashboard, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";

import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

export function AppNav() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/40"
    >
      <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/interview/create">
              <Plus className="h-4 w-4" />
              New interview
            </Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="gradient" size="sm" className="hidden sm:inline-flex">
            <Link href="/interview/create">
              <Plus className="h-4 w-4" />
              New
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="User menu"
              >
                <Avatar className="h-9 w-9 cursor-pointer hover:ring-primary/50 transition">
                  {user?.image && (
                    <AvatarImage src={user.image} alt={user.name ?? "User"} />
                  )}
                  <AvatarFallback>
                    {getInitials(user?.name ?? "U")}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {user?.name ?? "Account"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <UserIcon className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
