import { usePathname } from "next/navigation";
import Link from "next/link";
import FileText from "./icons/FileText";
import Sprout from "./icons/Sprout";
import User from "./icons/User";

const sidebarOptions = [
  {
    label: "Home",
    url: "/",
    icon: <FileText width="16" height="16" />,
  },
  {
    label: "Profile",
    url: "/profile",
    icon: <User width="16" height="16" />,
  },
  // {
  //   label: "Billing",
  //   url: "/billing",
  //   icon: <CreditCard width="16" height="16" />,
  // },
  // {
  //   label: "Settings",
  //   url: "/settings",
  //   icon: <Settings width="16" height="16" />,
  // },
  {
    label: "About Dev",
    url: "/about",
    icon: <Sprout width="16" height="16" />,
  },
];
const Sidebar = ({ hide = false, isMob = false }) => {
  const pathname = usePathname();

  const isActive = (url) => {
    if (url === pathname) {
      return true;
    }
    return false;
  };

  return (
    <aside
      className={`${isMob ? "" : "w-[200px] fixed"}
      ${hide ? "hidden md:flex" : ""} stretch flex-col gap-4 p-4 py-8 `}>
      {sidebarOptions.map(({ label, url, icon }) => {
        return (
          <Link key={label} href={url}>
            <div
              className={`py-2 px-4 rounded-md flex items-center gap-3
            ${isActive(url) ? "bg-gray-100" : "hover:bg-gray-100"}
            `}>
              {icon}
              {label}
            </div>
          </Link>
        );
      })}

      {/* <div className="mt-56 bg-gray-100 rounded-md text-center">
        <p>Credits</p>
      </div> */}
    </aside>
  );
};

export default Sidebar;
