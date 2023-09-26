import React from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const Layout = ({ children }) => {
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
