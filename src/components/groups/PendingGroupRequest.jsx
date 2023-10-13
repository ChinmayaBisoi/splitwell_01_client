import {
  createGroup,
  handleGroupInviteResponse,
} from "@/utils/firestore/group";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

const PendingGroupRequest = ({ group }) => {
  const { ownerEmail, name } = group;
  const [isLoading, setIsLoading] = useState(false);
  async function handleGroupInviteRequest({ response }) {
    setIsLoading(true);
    await handleGroupInviteResponse({ response, group })
      .then((res) => {
        if (res.ok) {
          toast({ title: "Joined group" });
        } else {
          toast({ title: "Unexpected error", variant: "destructive" });
        }
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
    <div className="p-4 rounded-md border border-gray-200 hover:shadow overflow-hidden">
      <p>
        <span className="font-semibold underline">{ownerEmail}</span> has
        invited you to join the group -{" "}
        <span className="font-semibold underline">{name}</span>
      </p>
      <div className="flex gap-3 mt-2">
        <Button
          onClick={() => {
            handleGroupInviteRequest({ response: true });
          }}
          loading={isLoading}
          className="p-0 px-4"
          size="sm">
          Accept
        </Button>
        <Button
          onClick={() => {
            handleGroupInviteRequest({ response: false });
          }}
          loading={isLoading}
          className="p-0 px-4"
          size="sm">
          Reject
        </Button>
      </div>
    </div>
  );
};

export default PendingGroupRequest;
