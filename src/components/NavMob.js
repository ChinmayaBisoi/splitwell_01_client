import React, { useRef } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import Hamburger from "./icons/Hamburger";

const NavMob = () => {
  const side = "left";
  const triggerRef = useRef(null);

  function closeSidebar() {
    triggerRef?.current?.click();
  }
  return (
    <Sheet key={side}>
      <SheetTrigger asChild>
        <div ref={triggerRef} className="min-w-[16px] md:hidden cursor-pointer">
          <Hamburger width="20" height="20" />
        </div>
      </SheetTrigger>
      <SheetContent side={side} className="z-[100]">
        <Sidebar isMob closeSidebar={closeSidebar} />
      </SheetContent>
    </Sheet>
  );
};

export default NavMob;
