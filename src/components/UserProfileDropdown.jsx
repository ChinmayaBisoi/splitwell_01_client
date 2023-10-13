import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import Link from "next/link";

const UserProfileDropdown = ({ user, handleLogout = () => {} }) => {
  const photoUrl = user?.photoUrl;
  const profileImageText = user?.displayName?.slice(0, 2)?.toUpperCase();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-10 h-10 flex items-center justify-center rounded-full relative">
          <span className="absolute h-7 w-7 animate-ping bg-black rounded-full" />
          {photoUrl ? (
            <Image
              src={photoUrl}
              height={32}
              width={32}
              className="h-10 min-w-[40px] rounded-full z-10"
              alt="user-photo"
            />
          ) : (
            <span className="z-10 h-8 w-8 flex text-lg items-center justify-center">
              {profileImageText}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 z-[100]">
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
