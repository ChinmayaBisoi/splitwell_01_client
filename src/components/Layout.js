import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router";

const urlsNotAllowed = ["/login", "/logout"];

const Layout = ({ children }) => {
  const { pathname } = useRouter();

  const noLayout = urlsNotAllowed.includes(pathname);
  if (noLayout) return <div>{children}</div>;
  return (
    <>
      <Navbar />
      <div className="">
        <Sidebar hide />
        <div className="h-[2000px] md:ml-[200px] p-4 md:p-8">{children}</div>
      </div>
    </>
  );
};

export default Layout;
