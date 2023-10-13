import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addNewExpense } from "@/utils/firestore/transactions";
import { useEffect, useRef, useState } from "react";
import DatePicker from "../DatePicker";
import ArrowRightSquare from "../icons/ArrowRightSquare";
import CheckIcon from "../icons/CheckIcon";
import ChevronLeft from "../icons/ChevronLeft";
import PiggyBankIcon from "../icons/PiggyBankIcon";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import CategoryPicker from "./CategoryPicker";
import PaidByPicker from "./PaidByPicker";

export const SPLIT_TYPES = {
  EQUALLY: "Equally",
  // UNEQUALLY: "Unequally",
  // PERCENTAGE: "Percentage",
};

const initialExpenseState = {
  selectedDate: new Date(),
  category: "General",
  description: "",
  amount: "",
};

export default function SettleUp({
  balances = [],
  user = {},
  groupDetails = [],
}) {
  const triggerRef = useRef(null);
  const [show, setShow] = useState(false);
  const balanceExpenseMap = balances[0]?.expenseMap || {};
  const balanceExpenseMapForUser = balanceExpenseMap[user.email] || {};
  const [isLoading, setIsLoading] = useState(false);

  const balanceArr = Object.keys(balanceExpenseMapForUser)
    .filter((m) => balanceExpenseMapForUser[m] !== 0)
    .map((k) => {
      const amount = balanceExpenseMapForUser[k];
      const otherParty = groupDetails.find((m) => m.userEmail === k);
      return { id: k, amount, otherParty };
    });

  const [selectedBalanceIdToSettle, setSelectedBalanceIdToSettle] = useState(
    balanceArr[0]?.id
  );

  const selectedBalanceToSettle = balanceArr.find(
    (k) => k.id === selectedBalanceIdToSettle
  );
  const [paymentAmount, setPaymentAmount] = useState(
    Math.floor(Math.abs(selectedBalanceToSettle?.amount ?? 0))
  );

  function resetForm() {}

  async function recordPayment() {
    if (!paymentAmount) {
      toast({ title: "Amount is a required field", varian: "destructive" });
    }

    const selectedBalanceToSettle = balanceArr.find(
      (k) => k.id === selectedBalanceIdToSettle
    );

    // const settleUpTransaction = {
    //   amount :
    // }
    const otherParty = {
      displayName: selectedBalanceToSettle.otherParty.userDisplayName,
      email: selectedBalanceToSettle.otherParty.userEmail,
      photoUrl: selectedBalanceToSettle.otherParty.userPhotoUrl,
      userId: selectedBalanceToSettle.otherParty.userId,
    };

    const you = {
      displayName: user.displayName,
      email: user.email,
      photoUrl: user.photoUrl,
      userId: user.userId,
    };

    const expenseMap = {
      [you.email]: {
        [otherParty.email]:
          selectedBalanceToSettle.amount > 0 ? +paymentAmount : -paymentAmount,
      },
      [otherParty.email]: {
        [you.email]:
          selectedBalanceToSettle.amount > 0 ? -paymentAmount : +paymentAmount,
      },
    };

    const settleUpObj = {
      type: "settle_up",
      amount: paymentAmount,
      paidBy: selectedBalanceToSettle.amount < 0 ? otherParty : you,
      paidTo: selectedBalanceToSettle.amount < 0 ? you : otherParty,
      expenseMap,
    };

    setIsLoading(true);
    await addNewExpense(settleUpObj, groupDetails[0].groupId)
      .then((res) => {
        if (res.ok) {
          toast({ title: "Payment recorded" });
        } else {
          toast({ title: "Unexpected error", variant: "destructive" });
        }
        setShow(false);
        triggerRef?.current?.click();
        resetForm();
      })
      .catch((err) => {
        toast({
          title: "Unexpected error",
          description: err.message || "",
          variant: "destructive",
        });
      });
    setIsLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button ref={triggerRef} size="sm" className="">
          Settle Up
        </Button>
      </DialogTrigger>
      <DialogContent
        overlayClassName="z-[100]"
        className="h-[100vh] z-[100] sm:h-[80vh] py-10">
        <DialogHeader className="mb-6">
          <DialogTitle className="">Settle Up</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col mt-4">
          <h2 className="text-gray-500 flex items-center justify-between gap-4 mb-4">
            <p>Select the balance you wish to settle up...</p>
            <div className="relative">
              <Button
                onClick={() => {
                  if (!selectedBalanceIdToSettle) return;
                  setShow(true);
                }}
                variant="secondary"
                size="sm"
                className="p-0 px-4">
                Next
              </Button>
              {show && (
                <div className="fixed top-0 left-0 bg-white p-4 h-full w-full z-[100] py-10">
                  <div className="flex items-center justify-between mb-6">
                    <Button
                      onClick={() => {
                        setShow(false);

                        setPaymentAmount(
                          Math.floor(Math.abs(selectedBalanceToSettle.amount))
                        );
                      }}
                      variant="secondary"
                      className="flex items-center gap-2">
                      <ChevronLeft />
                      <span>Back</span>
                    </Button>
                    <Button
                      variant="secondary"
                      loading={isLoading}
                      onClick={recordPayment}>
                      <CheckIcon />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-4 items-center">
                    <h2 className="font-medium text-xl">Record Payment</h2>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500" />
                      <ArrowRightSquare width={40} height={40} />
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500" />
                    </div>
                    <div className="flex flex-col items-center">
                      <p>
                        {selectedBalanceToSettle.amount > 0
                          ? `You paid ${selectedBalanceToSettle?.otherParty?.userDisplayName}`
                          : `${selectedBalanceToSettle?.otherParty?.userDisplayName} paid you`}
                      </p>
                      <p>{selectedBalanceToSettle?.otherParty?.userEmail}</p>
                    </div>
                    <div className="flex items-center ">
                      <div className="p-2 bg-gray-200 text-black">Rs.</div>
                      <Input
                        className="outline-none rounded-none text-lg max-w-[180px] text-black"
                        value={paymentAmount}
                        onChange={(e) => {
                          const newAmount = e.target.value;
                          const isNumericOrEmptyString =
                            /^[0-9]+$/.test(newAmount) || newAmount === "";
                          if (!isNumericOrEmptyString) return;
                          setPaymentAmount(newAmount);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </h2>
          <div className="flex flex-col mt-2">
            {balanceArr.map((k) => {
              const amount = k.amount;
              const otherParty = k.otherParty;
              return (
                <div
                  key={k.id}
                  onClick={() => {
                    setSelectedBalanceIdToSettle(k.id);
                    const selectedBalanceToSettle = balanceArr.find(
                      (m) => m.id === k.id
                    );

                    setPaymentAmount(
                      Math.floor(Math.abs(selectedBalanceToSettle.amount))
                    );
                  }}
                  className="font-medium hover:bg-gray-100 p-2 hover:cursor-pointer flex items-center justify-between gap-4">
                  <p>
                    {amount > 0 ? (
                      <p className="text-red-700">
                        {"> "}You owe {otherParty?.userDisplayName} Rs.
                        {Math.abs(amount)}
                      </p>
                    ) : (
                      <p className="text-emerald-700">
                        {"> "}
                        {otherParty?.userDisplayName} owes you Rs.
                        {Math.abs(amount)}
                      </p>
                    )}
                  </p>
                  {selectedBalanceIdToSettle === k.id && <CheckIcon />}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
