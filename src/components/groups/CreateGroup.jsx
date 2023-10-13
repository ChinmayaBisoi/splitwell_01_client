import { createGroup } from "@/utils/firestore/group";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";

const initialFormState = {
  name: "",
  description: "",
};
export function CreateGroup({ isLoggedIn }) {
  const [{ name, description }, setFormState] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);

  const triggerRef = useRef(null);

  function handleChange(e) {
    setFormState((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function resetForm() {
    setFormState(initialFormState);
  }

  function closeModal() {
    triggerRef?.current?.click();
    resetForm();
  }

  async function handleCreateGroup() {
    //
    if (!name) {
      toast({
        title: "Group name is a required field",
        description: "",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    await createGroup({ name, description }).then((res) => {
      if (res.ok) {
        toast({ title: "Group created." });
      }
    });

    setIsLoading(false);
    closeModal();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          ref={triggerRef}
          onClick={resetForm}
          className="flex items-center gap-1">
          <span>+</span>
          <span>Create Group</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        overlayClassName="z-[100]"
        className="sm:max-w-[425px] top-[40%] z-[100]">
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
              value={name}
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
              value={description}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            loading={isLoading}
            disabled={!isLoggedIn || isLoading}
            onClick={handleCreateGroup}>
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
