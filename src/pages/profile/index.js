import Shimmer from "@/components/Shimmer";
import { useLoginState } from "@/context/login-context";
import Image from "next/image";
import React from "react";

const ProfileField = ({ label, value }) => {
  return (
    <div className="">
      <div className="font-semibold w-28">{label}</div>
      <div>{value}</div>
    </div>
  );
};

const ProfilePage = () => {
  const { isLoggedIn, user, loading } = useLoginState();

  return (
    <>
      <div className="flex flex-col">
        <h1 className="font-semibold text-4xl mb-6">Profile</h1>
        {loading ? (
          <div className="flex flex-col gap-4">
            <Shimmer className={"h-24 w-24 rounded-full"} />
            <Shimmer className="md:w-3/5 w-4/5" />
            <Shimmer className="md:w-3/5 w-4/5" />
          </div>
        ) : !isLoggedIn ? (
          <div>Please login to view your details</div>
        ) : (
          <div className="flex flex-col gap-4">
            {user.photoUrl && (
              <Image
                src={user.photoUrl}
                width={100}
                height={100}
                alt="user-image"
                className="rounded-full"
              />
            )}
            <ProfileField label={"Name"} value={user.displayName} />
            <ProfileField label={"Email"} value={user.email} />
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
