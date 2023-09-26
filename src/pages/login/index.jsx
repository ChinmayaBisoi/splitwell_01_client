import AuthForm from "@/components/AuthForm";
import ChevronLeft from "@/components/icons/ChevronLeft";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:p-8 p-4">
      <Button variant="ghost" className="self-start">
        <Link href="/" className="flex gap-2 items-center">
          <ChevronLeft />
          <span>Back</span>
        </Link>
      </Button>
      <AuthForm type="login" />
    </div>
  );
};

export default LoginPage;
