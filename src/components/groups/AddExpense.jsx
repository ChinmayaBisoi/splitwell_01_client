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
import { useRef, useState } from "react";
import DatePicker from "../DatePicker";
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

export default function AddExpense({ groupDetails = [], user = null }) {
  const [isLoading, setIsLoading] = useState(false);
  const triggerRef = useRef(null);

  const you = groupDetails
    .filter((k) => k.userEmail === user.email)
    .map((k) => ({
      email: k.userEmail,
      userId: k.userId,
      photoUrl: k.userPhotoUrl,
      displayName: k.userDisplayName,
      role: k.role,
    }))[0];
  const others = groupDetails
    .filter((k) => k.userEmail !== user.email)
    .map((k) => ({
      email: k.userEmail,
      userId: k.userId,
      photoUrl: k.userPhotoUrl,
      displayName: k.userDisplayName,
      role: k.role,
    }));
  const groupId = groupDetails[0]?.groupId;
  const [expense, setExpense] = useState({
    ...initialExpenseState,
    paidBy: {
      type: SPLIT_TYPES.EQUALLY,
      members: [you],
    },
    selectedDate: new Date(),
    splitAs: { type: SPLIT_TYPES.EQUALLY, members: [you, ...others] },
  });

  function resetForm() {
    setExpense({
      ...initialExpenseState,
      paidBy: {
        type: SPLIT_TYPES.EQUALLY,
        members: [you],
      },
      split: { type: SPLIT_TYPES.EQUALLY, members: [you, ...others] },
    });
  }

  function setSelectedDate(newSelectedDate) {
    setExpense((prev) => ({ ...prev, selectedDate: newSelectedDate }));
  }

  function setCategory(newCategory) {
    setExpense((prev) => ({ ...prev, category: newCategory }));
  }

  function handleDescriptionChange(e) {
    setExpense((prev) => ({ ...prev, description: e.target.value }));
  }

  function handleAmountChange(e) {
    const newAmount = e.target.value;
    const isNumericOrEmptyString =
      /^[0-9]+$/.test(newAmount) || newAmount === "";
    if (!isNumericOrEmptyString) return;
    setExpense((prev) => ({ ...prev, amount: newAmount }));
  }

  async function handleAddExpense() {
    if (!expense.amount) {
      toast({ title: "Amount is required", variant: "destructive" });
      return;
    }
    if (!expense.description) {
      toast({ title: "Description is required", variant: "destructive" });
      return;
    }

    if (!expense.paidBy.members.length) {
      toast({
        title: "At least one person must pay an amount to an expense",
        variant: "destructive",
      });
      return;
    }
    if (!expense.split.members.length) {
      toast({
        title: "At least one person must owe an amount to an expense",
        variant: "destructive",
      });
      return;
    }

    const allMembersIds = groupDetails.map((k) => k.userEmail);

    const membersMap = {};
    for (let i = 0; i < allMembersIds.length; i++) {
      const id = allMembersIds[i];
      membersMap[id] = {};
      for (let j = 0; j < allMembersIds.length; j++) {
        const id2 = allMembersIds[j];
        if (id !== id2) {
          membersMap[id][id2] = 0;
        }
      }
    }

    if (
      expense.paidBy.type === SPLIT_TYPES.EQUALLY &&
      expense.split.type === SPLIT_TYPES.EQUALLY
    ) {
      const lenders = expense.paidBy.members;
      const borrowers = expense.split.members;
      const amountBorrowedPerPerson = Number(
        Number(expense.amount / borrowers.length).toFixed(2)
      );
      const amountLentPerPerson = Number(
        Number(expense.amount / lenders.length).toFixed(2)
      );

      let borrowers2 = borrowers.map((k) => ({
        ...k,
        amount: amountBorrowedPerPerson,
      }));

      borrowers2 = [
        ...borrowers2,
        ...lenders.map((k) => ({ ...k, amount: 0 })),
      ];

      borrowers2 = borrowers2.map((k) => {
        const found = lenders.find((m) => m.email === k.email);
        if (found) {
          return { ...k, amount: k.amount - amountLentPerPerson };
        } else {
          return k;
        }
      });

      const thoseWhoWillPay = borrowers2.filter((k) => k.amount > 0);

      if (thoseWhoWillPay.length > 0) {
        const thoseWhoWillReceive = borrowers2.filter((k) => k.amount < 0);
        const amountTheyWillPay =
          thoseWhoWillPay[0]?.amount ?? 0 / thoseWhoWillReceive.length;
        for (let m of thoseWhoWillPay) {
          for (let n of thoseWhoWillReceive) {
            membersMap[m.email][n.email] = amountTheyWillPay;
            membersMap[n.email][m.email] = -amountTheyWillPay;
          }
        }
      }
    }

    for (let d1 of Object.keys(membersMap)) {
      for (let d2 of Object.keys(membersMap[d1])) {
        membersMap[d1][d2] = Number(membersMap[d1][d2].toFixed(2));
      }
    }

    const transactionData = { ...expense, expenseMap: membersMap };

    setIsLoading(true);
    await addNewExpense(transactionData, groupId)
      .then((res) => {
        if (res.ok) {
          toast({ title: "Expense added" });
        } else {
          toast({ title: "Unexpected error", variant: "destructive" });
        }
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
        <Button
          ref={triggerRef}
          size="sm"
          onClick={resetForm}
          className="flex items-center gap-1">
          <span>+</span>
          <span>Add Expense</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        overlayClassName="z-[100]"
        className="h-[100vh] z-[100] sm:h-[80vh]">
        {/* <DialogCloser className="hidden dialogCloser"></DialogCloser> */}
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-2">
            Add Expense
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <DatePicker
            selectedDate={expense.selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <div className="flex gap-2">
            <CategoryPicker
              category={expense.category}
              setCategory={setCategory}
            />
            <Input
              placeholder="Add a description.."
              className="outline-none"
              value={expense.description}
              onChange={handleDescriptionChange}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="p-2">
              <PiggyBankIcon width={20} height={20} />
            </Button>
            <Input
              placeholder="0.00"
              className="outline-none"
              type="text"
              value={expense.amount}
              onChange={handleAmountChange}
            />
          </div>
          <div className="flex gap-2 items-center">
            <span>Paid by</span>
            <PaidByPicker
              expenseKey="paidBy"
              you={you}
              others={others}
              expense={expense}
              setExpense={setExpense}
            />
            <span>and</span>
            <span>Split</span>
            <PaidByPicker
              expenseKey="split"
              you={you}
              others={others}
              expense={expense}
              setExpense={setExpense}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            loading={isLoading}
            disabled={isLoading}
            onClick={handleAddExpense}
            className={"mt-4"}>
            Add Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
