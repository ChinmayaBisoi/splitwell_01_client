import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FriendsContext } from "@/context/friends-context";
import { useOnOutsideClick } from "@/hooks/useOnOutsideClick";
import { sendFriendRequest } from "@/utils/firestore/friend-request";
import { createGroup } from "@/utils/firestore/group";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "../ui/use-toast";

export function AddFriend({ triggerVariant, isLoggedIn, group = null }) {
  const [friendEmailOrId, setFriendEmailOrId] = useState("");
  const [loadingReq, setLoadingReq] = useState(false);
  const [showFriendsToInvite, setShowFriendsToInvite] = useState(false);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const { friends, isLoading: isLoadingFriends } = useContext(FriendsContext);

  const friendsToInvite = friends.filter((k) =>
    k?.email?.includes(friendEmailOrId)
  );

  function resetForm() {
    setFriendEmailOrId("");
    inputRef?.current?.click();
  }

  function closePopover() {
    resetForm();
    triggerRef?.current?.click();
  }

  async function handleSendGroupInvite() {
    if (!friendEmailOrId || !group) return;
    setLoadingReq(true);

    await createGroup({ baseGroup: group, friendEmail: friendEmailOrId })
      .then((res) => {
        if (res.ok) {
          toast({ title: "Group invite sent." });
        }
      })
      .catch((err) => {
        toast({
          title: "Error sending group invite.",
          description: err.message || "",
          variant: "destructive",
        });
      });

    setLoadingReq(false);
  }

  async function handleSendFriendRequest() {
    if (!friendEmailOrId) return;
    setLoadingReq(true);

    await sendFriendRequest(friendEmailOrId)
      .then((res) => {
        if (res.ok) {
          toast({
            title: "Friend request sent.",
          });
        }
        closePopover();
      })
      .catch((err) => {
        toast({
          title: err.message,
          variant: "destructive",
        });
      });

    setLoadingReq(false);
  }

  useEffect(() => {
    function handleClickOutsideDropdown(event) {
      if (
        inputRef?.current &&
        !inputRef?.current?.contains(event.target) &&
        dropdownRef?.current &&
        !dropdownRef?.current?.contains(event.target)
      ) {
        if (showFriendsToInvite) {
          setShowFriendsToInvite(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
    };
  }, [inputRef, dropdownRef, showFriendsToInvite]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          ref={triggerRef}
          onClick={resetForm}
          variant={triggerVariant || "secondary"}
          className="">
          {group ? "Invite Friend" : "Add Friend"}
        </Button>
      </DialogTrigger>
      <DialogContent
        overlayClassName="z-[100]"
        className="h-[100vh] z-[100] sm:h-fit sm:top-[40%]">
        {/* <DialogCloser className="hidden dialogCloser"></DialogCloser> */}
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-2">
            {group ? "Invite Friend" : "Add Friend"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              Add your friend {!!group && "to this group"}
            </h4>
            <p className="text-sm text-muted-foreground">
              Enter the Email Id of your friend{" "}
              {!!group && "or select from the dropdown"}.
            </p>
          </div>
          <div className="relative">
            <Input
              ref={inputRef}
              onChange={(e) => {
                setFriendEmailOrId(e.target.value);
              }}
              onFocus={() => {
                setShowFriendsToInvite(true);
              }}
              value={friendEmailOrId}
            />
            {showFriendsToInvite && friendsToInvite.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute top-[110%] left-0 bg-white w-[80%] border border-gray-200 rounded-lg text-sm max-h-44 overflow-y-scroll">
                {friendsToInvite.map((friend) => {
                  return (
                    <div
                      key={friend.email}
                      onClick={() => {
                        setFriendEmailOrId(friend.email);
                        setShowFriendsToInvite(false);
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-200">
                      {friend.email}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="mt-6"
            onClick={() => {
              if (!group) {
                handleSendFriendRequest();
              } else {
                handleSendGroupInvite();
              }
            }}
            disabled={!isLoggedIn || loadingReq}
            loading={loadingReq}>
            {!!group ? "Invite Friend" : "Send Friend Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
