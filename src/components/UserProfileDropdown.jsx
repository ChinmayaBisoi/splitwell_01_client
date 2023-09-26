import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import logout from "@/pages/api/auth/logout";
import { useLoginStateDispatch } from "@/context/login-context";
import { useToast } from "./ui/use-toast";

const UserProfileDropdown = ({ email }) => {
  const loginStateDispatch = useLoginStateDispatch();
  const { toast } = useToast();
  const profileImageText = email?.slice(0, 2)?.toUpperCase();

  async function handleLogout() {
    await logout()
      .then((res) => {
        console.log(res);
        if (res.ok) {
          loginStateDispatch({
            type: "logout",
          });
          toast({
            title: "Logout Successful",
            description: "",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Unexpected error duing logging out",
          description: err,
        });
      });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-10 h-10 flex items-center justify-center text-xl rounded-full relative">
          <span className="absolute h-6 w-6 animate-ping bg-gray-200 rounded-full" />
          <span className="z-10 h-8 w-8 flex items-center justify-center">
            {profileImageText}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="flex flex-col gap-4">
          <Link className="w-full" href={"/profile"}>
            <Button className="w-full" variant="secondary">
              Profile
            </Button>
          </Link>

          <Button onClick={handleLogout} className="">
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserProfileDropdown;
