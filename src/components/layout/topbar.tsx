"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "./mobile-nav";

export function Topbar() {
  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-background border-b">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden ml-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <MobileNav />
        </SheetContent>
      </Sheet>

      <div className="flex-1 px-4 flex justify-between items-center">
        <div className="flex-1 flex">
          <h2 className="text-xl font-semibold md:hidden">Zyra</h2>
        </div>
        <div className="ml-4 flex items-center md:ml-6 gap-4">
          <Button variant="outline" size="sm">
            Notifications
          </Button>
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
