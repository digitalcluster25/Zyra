"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

export function UserButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!session) {
    return (
      <Button asChild size="sm" variant="outline">
        <Link href="/auth/signin">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Link>
      </Button>
    );
  }

  const initials = session.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="flex items-center gap-2">
      <Link href="/profile">
        <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || "User"} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
