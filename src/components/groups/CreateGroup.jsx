import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogCloser,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

const initialGroupState = {
  name: "",
  description: "",
};
export function CreateGroup() {
  const [groupState, setGroupState] = useState(initialGroupState);

  function handleChange(e) {
    setGroupState((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function closeModal() {
    document.querySelector(".dialogCloser").click();
  }

  function handleCreateGroup() {
    //
    closeModal();
  }

  useEffect(() => {
    console.log(groupState);
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <span>+</span>
          <span>Create Group</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogCloser className="hidden dialogCloser"></DialogCloser>
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Add a group to start tracking your expenses.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Group Name
            </Label>
            <Input
              id="name"
              name="name"
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              name="description"
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateGroup}>Create Group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
