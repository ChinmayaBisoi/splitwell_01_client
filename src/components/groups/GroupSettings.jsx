import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const GroupSettings = ({ groupDetails }) => {
  const members = groupDetails.filter((k) => k.role === "member");
  const group = groupDetails.find((k) => k.role === "owner");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="">
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent
        overlayClassName="z-[100]"
        className="h-[100vh] z-[100] w-[100vw] py-10">
        {/* <DialogCloser className="hidden dialogCloser"></DialogCloser> */}
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-2">
            Settings
          </DialogTitle>
        </DialogHeader>
        <div className="">
          <div>
            <div className="mb-4">
              <div className="mb-1 font-medium">{"> "}Group Name</div>
              <div className="underline pl-3">{group?.name}</div>
            </div>
            {group?.description && (
              <div className="mb-4">
                <div className="mb-1 font-medium">{"> "}Group Description</div>
                <div className="underline pl-3">{group?.description}</div>
              </div>
            )}
            <div className="mb-4">
              <div className="mb-1 font-medium">{"> "}Owner</div>
              <div className="underline pl-3">{group?.ownerEmail}</div>
            </div>
            <div>
              <div className="mb-1 font-medium">{"> "}Group Members</div>
              <div className="max-h-[300px] overflow-y-auto pl-3">
                {members.length > 0 ? (
                  members.map((k) => {
                    return (
                      <div key={k.userEmail} className="underline">
                        {k.userEmail}
                      </div>
                    );
                  })
                ) : (
                  <div>No members present.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupSettings;
