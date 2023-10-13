import { deleteTransaction } from "@/utils/firestore/transactions";
import { format } from "date-fns";
import React, { Fragment, useState } from "react";
import ReceiptIcon from "../icons/category/ReceiptIcon";
import ChevronLeft from "../icons/ChevronLeft";
import MoneyIcon from "../icons/MoneyIcon";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { categories } from "./CategoryPicker";

const ExpenseTransaction = ({ transaction = {}, user = {} }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const peoplePaid = transaction?.paidBy?.members;
  const peopleReceived = transaction?.split?.members;
  const createdAt = transaction.createdAt.toDate();
  const amount = transaction.amount;
  const description = transaction.description;
  const CategoryIcon = categories.find(
    (k) => k.label === transaction.category
  )?.icon;

  function calculateTotalFor(email) {
    const expenseMap = transaction.expenseMap;
    let total = 0;

    for (let t in expenseMap[email]) {
      total += expenseMap[email][t];
    }

    return total;
  }

  const userTotal = calculateTotalFor(user?.email);

  function openModal() {
    setShow(true);
    const body = document?.querySelector("body");
    body.style.overflowY = "hidden";
  }

  function closeModal() {
    setShow(false);
    const body = document?.querySelector("body");
    body.style.overflowY = "auto";
  }

  async function handleDeleteTransaction() {
    setLoading(true);
    await deleteTransaction(transaction, transaction.groupId)
      .then((res) => {
        if (res.ok) {
          toast({ title: "Payment record deleted." });
        } else {
          toast({ title: "Unexpected Error", variant: "destructive" });
        }
      })
      .catch((err) => {
        toast({
          title: "Unexpected Error",
          description: err.message || "",
          variant: "destructive",
        });
      });
    setLoading(false);
  }

  return (
    <div className="relative">
      <div
        onClick={() => {
          openModal();
        }}
        className={`grid grid-cols-4 max-w-[500px] p-2 hover:bg-gray-100 cursor-pointer min-h-[76px] min-[400px]:h-auto`}>
        <div className="col-span-1 flex gap-1">
          <div className="flex flex-col self-center items-center">
            <p className="text-xs">{format(createdAt, "MMM")}</p>
            <p className="text-sm">{format(createdAt, "dd")}</p>
          </div>
          <div
            className={`p-1 flex justify-center items-center ${
              userTotal > 0
                ? "bg-red-300"
                : userTotal < 0
                ? "bg-emerald-400"
                : "bg-gray-200"
            }`}>
            {CategoryIcon ? (
              CategoryIcon
            ) : (
              <ReceiptIcon width={20} height={20} />
            )}
          </div>
        </div>
        <div className="col-span-2 flex flex-col justify-center">
          <p className="text-sm">{description}</p>
          {peoplePaid.length > 1 ? (
            <p className="text-xs">
              <span className="font-medium text-sm">{peoplePaid.length}</span>{" "}
              people paid{" "}
              <span className="font-medium text-sm">Rs.{amount}</span>
            </p>
          ) : (
            <p className="text-xs">
              <span className="font-medium text-sm">
                {peoplePaid[0]?.displayName.split(" ")[0] +
                  " " +
                  peoplePaid[0]?.displayName.split(" ")[1][0]}
                .
              </span>{" "}
              paid <span className="font-medium text-sm">Rs.{amount}</span>
            </p>
          )}
        </div>
        <div
          className={`text-right flex flex-col justify-center col-span-1 ${
            userTotal > 0
              ? "text-red-600"
              : userTotal < 0
              ? "text-green-800"
              : ""
          }`}>
          <p className={`text-xs `}>
            {userTotal > 0
              ? `You borrowed`
              : userTotal < 0
              ? `You lent`
              : "~NA"}
          </p>
          <p>{Math.abs(userTotal) > 0 ? Math.abs(userTotal) : ""}</p>
        </div>
      </div>
      {show && (
        <div className="fixed flex items-center justify-center z-[100] overflow-hidden top-0 left-0 bg-white/90 backdrop-blur-sm w-screen h-screen">
          <div className="bg-white md:w-[70vw] md:h-[80vh] md:max-w-[500px] ease-in-out duration-300 w-[100vw] p-4 h-[100vh] border shadow border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={closeModal}
                variant="secondary"
                className="flex items-center gap-2">
                <ChevronLeft />
                <span>Back</span>
              </Button>
              <Button
                loading={loading}
                variant="destructive"
                onClick={handleDeleteTransaction}>
                Delete
              </Button>
            </div>
            <div className="flex flex-col items-center gap-4 max-h-[420px] overflow-y-scroll">
              <MoneyIcon width={60} height={60} className="text-green-700" />
              <div className="flex gap-4 items-center">
                <p>Total Amount</p>
                <p>Rs.{transaction.amount}</p>
              </div>
              <div className="flex flex-col items-center">
                <p>Paid Equally By</p>
                {peoplePaid.map((person) => {
                  return (
                    <Fragment key={person.email}>
                      <p>{person.email}</p>
                      <p className="text-xs">({person.displayName})</p>
                    </Fragment>
                  );
                })}
              </div>
              <div className="flex flex-col items-center">
                <p>Paid Equally To</p>
                {peopleReceived.map((person) => {
                  return (
                    <Fragment key={person.email}>
                      <p>{person.email}</p>
                      <p className="text-xs">({person.displayName})</p>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTransaction;
