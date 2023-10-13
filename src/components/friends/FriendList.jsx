import Image from "next/image";
import React from "react";
import MinusCircle from "../icons/MinusCircle";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const DeleteFriend = ({ friendEmail, docId }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-fit h-fit rounded-full p-0">
          <MinusCircle width={20} height={20} />
        </Button>
      </DialogTrigger>
      <DialogContent
        overlayClassName="z-[100]"
        className="h-[100vh] z-[100] sm:h-fit sm:top-[40%]">
        {/* <DialogCloser className="hidden dialogCloser"></DialogCloser> */}
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-2">
            Remove Friend
          </DialogTitle>
        </DialogHeader>
        <div className="">
          Are you sure you want to remove{" "}
          <span className="font-medium underline">{friendEmail}</span> from your
          friend list ?
        </div>
        <DialogFooter>
          <Button variant="destructive" type="submit" className="mt-6">
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const FriendList = ({ friends = [] }) => {
  return (
    <div className="mt-6">
      <div className="text-lg font-semibold mb-2">Friend List</div>
      <div className="flex flex-col max-w-[500px]">
        {friends.length > 0 ? (
          friends.map((friend) => {
            return (
              <div
                key={friend.id}
                className="md:p-2 py-2 md:px-4 border-b border-gray-300 flex items-center justify-between gap-1">
                <div className="flex gap-2 items-center overflow-hidden">
                  {friend?.photoUrl ? (
                    <Image
                      src={friend.photoUrl}
                      alt={"user-logo"}
                      width={32}
                      height={32}
                      className=""
                    />
                  ) : (
                    <div className="w-6 h-6 min-w-[24px] bg-gray-200">
                      {friend.displayName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <p>{friend.email}</p>
                </div>
                {/* <DeleteFriend friendEmail={friend.email} docId={friend.id} /> */}
              </div>
            );
          })
        ) : (
          <div>Add friends to view here.</div>
        )}
      </div>
    </div>
  );
};

export default FriendList;
