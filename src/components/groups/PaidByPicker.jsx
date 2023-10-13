import { useEffect, useState } from "react";
import CheckIcon from "../icons/CheckIcon";
import ChevronLeft from "../icons/ChevronLeft";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { SPLIT_TYPES } from "./AddExpense";

const PaidByPicker = ({
  expenseKey = "",
  you = {},
  others = [],
  expense = {},
  setExpense = () => {},
}) => {
  const SPLIT_OPTIONS = Object.values(SPLIT_TYPES);
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(SPLIT_OPTIONS[0]);
  const [tempSplitDetails, setTempSplitDetails] = useState(expense[expenseKey]);
  const allMembers = [you, ...others];

  const splitDetails = expense[expenseKey];

  const amount = expense?.amount || 0;

  function handleExpense() {
    // actually change using that setExpense
    setExpense((prev) => ({
      ...prev,
      [expenseKey]: tempSplitDetails,
    }));
    setOpen(false);
  }

  return (
    <div className="relative">
      <Button
        onClick={() => {
          setTempSplitDetails(expense[expenseKey]);
          setOpen(true);
        }}
        variant="outline">
        {splitDetails?.members.length === 1 &&
        splitDetails?.members[0].email === you.email
          ? "You"
          : `${splitDetails?.members.length} people`}
      </Button>
      {open && (
        <div className="fixed top-0 left-0 bg-white p-4 h-full w-full z-[100] py-10">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => {
                setOpen(false);
              }}
              variant="secondary"
              className="flex items-center gap-2">
              <ChevronLeft />
              <span>Back</span>
            </Button>
            <Button variant="secondary" onClick={handleExpense}>
              <CheckIcon />
            </Button>
          </div>

          <div className="flex mb-2">
            {SPLIT_OPTIONS.map((option) => {
              return (
                <Button
                  key={option}
                  variant={selectedOption === option ? "secondary" : "outline"}
                  onClick={() => {
                    setSelectedOption(option);
                  }}
                  size="sm"
                  className="text-center rounded-none">
                  {option}
                </Button>
              );
            })}
          </div>
          <div className="mb-2 pl-1 font-semibold">
            {"> "}Amount : {amount}
          </div>
          {selectedOption === SPLIT_TYPES.EQUALLY &&
            !!tempSplitDetails.members.length && (
              <div className="mb-3 pl-1 font-semibold">
                {"> "} Amount per person :
                <span className="px-1">
                  {(amount / tempSplitDetails.members.length).toFixed(2)}
                </span>{" "}
              </div>
            )}
          <div className="max-h-[200px] overflow-y-auto">
            {allMembers.map((member) => {
              return (
                <div key={member.email}>
                  <Label className="hover:bg-gray-100 px-1 flex items-center justify-between max-w-[375px] text-lg">
                    <div className="max-w-[324px] overflow-hidden">
                      {member.email}
                    </div>
                    <Input
                      onChange={(e) => {
                        const addMember = e.target.checked === true;
                        const members = tempSplitDetails.members;
                        setTempSplitDetails((prev) => ({
                          ...prev,
                          members: addMember
                            ? [...members, member]
                            : members.filter((k) => k.email !== member.email),
                        }));
                      }}
                      checked={
                        tempSplitDetails.members.find(
                          (k) => k.email === member.email
                        )
                          ? true
                          : false
                      }
                      type="checkbox"
                      className="w-4 h-4 min-w-[16px]"
                    />
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaidByPicker;
