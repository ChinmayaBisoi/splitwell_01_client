import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import ReceiptIcon from "../icons/category/ReceiptIcon";
import WifiIcon from "../icons/category/WifiIcon";
import WaterIcon from "../icons/category/WaterIcon";
import CartIcon from "../icons/category/CartIcon";
import { useOnOutsideClick } from "@/hooks/useOnOutsideClick";

export const categories = [
  {
    icon: <ReceiptIcon width={20} height={20} />,
    label: "General",
  },
  {
    icon: <WifiIcon width={20} height={20} />,
    label: "Wifi",
  },
  {
    icon: <WaterIcon width={20} height={20} />,
    label: "Water",
  },
  {
    icon: <CartIcon width={20} height={20} />,
    label: "Groceries",
  },
];

export default function CategoryPicker({
  category = "General",
  setCategory = () => {},
}) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const categoriesRef = React.useRef(null);
  const triggerRef = React.useRef(null);

  const filteredCategories = categories.filter((k) =>
    k.label.toLowerCase().includes(searchQuery)
  );

  function closeDropdown() {
    setSearchQuery("");
    setOpen(false);
  }

  function handleCategoryChange(newCategory) {
    setCategory(newCategory);
    closeDropdown();
  }

  React.useEffect(() => {
    function handleClickOutsideDropdown(event) {
      if (
        triggerRef?.current &&
        !triggerRef?.current?.contains(event.target) &&
        categoriesRef?.current &&
        !categoriesRef?.current?.contains(event.target)
      ) {
        closeDropdown();
      }
    }

    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
    };
  }, [triggerRef, categoriesRef]);

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        ref={triggerRef}
        className="px-2">
        {category && categories.find((k) => k.label === category)?.icon}
      </Button>

      {open && (
        <div
          ref={categoriesRef}
          className="absolute top-[110%] z-[100] left-0 bg-white rounded-lg border border-gray-300">
          <div className="w-40">
            <Input
              placeholder="Search category.."
              className="outline-none rounded-b-none border-t-0 border-x-0 border-b"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <div className="max-h-[300px] divide-y">
              {filteredCategories.map((item) => {
                return (
                  <div
                    key={item.label}
                    onClick={() => {
                      handleCategoryChange(item.label);
                    }}
                    className="hover:bg-gray-100 p-2 py-1 text-sm cursor-pointer flex items-center gap-2">
                    <span className="p-1 bg-gray-200">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
