import { deleteTransaction } from "@/utils/firestore/transactions";
import { format } from "date-fns";
import React, { useState } from "react";
import CheckIcon from "../icons/CheckIcon";
import ChevronLeft from "../icons/ChevronLeft";
import DeleteIcon from "../icons/DeleteIcon";
import MoneyIcon from "../icons/MoneyIcon";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

const SettledTransaction = ({ transaction = {}, user = {} }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const createdAt = transaction.createdAt.toDate();
  const paidByPerson = transaction.paidBy;
  const paidToPerson = transaction.paidTo;

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
        toast({ title: "Unexpected Error", variant: "destructive" });
      });
    setLoading(false);
  }

  return (
    <div className="relative">
      <div
        onClick={openModal}
        className={`grid grid-cols-4 max-w-[500px] p-2 hover:bg-gray-100 cursor-pointer min-h-[76px] min-[400px]:h-auto`}>
        <div className="col-span-1 flex gap-1">
          <div className="flex flex-col self-center items-center">
            <p className="text-xs">{format(createdAt, "MMM")}</p>
            <p className="text-sm">{format(createdAt, "dd")}</p>
          </div>
          <div className={`flex items-center justify-center`}>
            <MoneyIcon height={28} width={28} />
          </div>
        </div>
        <div className="col-span-3 flex flex-col justify-center">
          <p className="text-sm">
            <span className="font-medium">{paidByPerson.displayName}</span> paid{" "}
            <span className="font-medium">{paidToPerson.displayName}</span> Rs.
            {transaction.amount}{" "}
          </p>
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
            <div className="flex flex-col items-center gap-4">
              <MoneyIcon width={60} height={60} className="text-green-700" />
              <p>Rs.{transaction.amount}</p>
              <div className="flex flex-col items-center">
                <p>Paid By</p>
                <p>{paidByPerson.email}</p>
                <p className="text-xs">({paidByPerson.displayName})</p>
              </div>
              <div className="flex flex-col items-center">
                <p>Paid To</p>
                <p>{paidToPerson.email}</p>
                <p className="text-xs">({paidToPerson.displayName})</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettledTransaction;
