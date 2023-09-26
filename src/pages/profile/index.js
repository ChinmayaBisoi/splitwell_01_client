import Layout from "@/components/Layout";
import { useLoginState } from "@/context/login-context";
import React from "react";

const ProfilePage = () => {
  const loginState = useLoginState();
  const isLoggedIn = loginState.isLoggedIn;
  const userEmail = loginState.email;
  return (
    <Layout>
      <div className="flex flex-col">
        <h1 className="font-semibold text-4xl mb-6">Profile</h1>
        {!isLoggedIn ? (
          <div>Please login to view your details</div>
        ) : (
          <div className="flex flex-cols md:flex-row md:gap-4 md:items-center">
            <div className="font-semibold">Email : </div>
            <div>{userEmail}</div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
