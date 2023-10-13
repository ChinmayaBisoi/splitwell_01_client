import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import CalendarIcon from "./icons/CalendarIcon";
import { Calendar } from "./ui/calendar";

const DatePicker = ({
  selectedDate = new Date(),
  setSelectedDate = () => {},
}) => {
  const [show, setShow] = useState(false);
  const formattedSelectedDate = format(selectedDate, "MMM dd, yyyy");
  const triggerRef = useRef(null);
  const calendarRef = useRef(null);

  function showCalendar() {
    setShow(true);
  }

  function toggleShowCalendar() {
    setShow((prev) => !prev);
  }

  function handleDateSelection(e) {
    setSelectedDate(e);
    setShow(false);
  }

  useEffect(() => {
    function handleClickOutsideDropdown(event) {
      if (
        triggerRef?.current &&
        !triggerRef?.current?.contains(event.target) &&
        calendarRef?.current &&
        !calendarRef?.current?.contains(event.target)
      ) {
        setShow(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
    };
  }, [triggerRef, calendarRef]);

  return (
    <div className="relative">
      <Button
        onClick={toggleShowCalendar}
        variant="outline"
        ref={triggerRef}
        className="flex items-center gap-2">
        <CalendarIcon width={16} height={16} />
        <span>{formattedSelectedDate}</span>
      </Button>
      {show && (
        <div
          ref={calendarRef}
          className="rounded-md bg-white border absolute top-[110%] left-0 z-[100]">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelection}
            className=""
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
