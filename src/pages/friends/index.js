import FriendList from "@/components/friends/FriendList";
import FriendRequests from "@/components/friends/FriendRequests";
import { AddFriend } from "@/components/groups/AddFriend";
import LaughIcon from "@/components/icons/LaughIcon";
import Shimmer from "@/components/Shimmer";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { FriendsContext } from "@/context/friends-context";
import { useLoginState } from "@/context/login-context";
import useCollection from "@/hooks/useCollection";
import { friendRequestCollectionRef } from "@/utils/firebase";
import { updateFriendRequestStatus } from "@/utils/firestore/friend-request";
import { limit, or, orderBy, query, where } from "firebase/firestore";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

const FriendsPage = () => {
  const { isLoggedIn, loading: loadingUser, user } = useLoginState();
  const {
    allFriendRequests,
    sentRequests,
    friendRequests,
    friends,
    isLoading: loadingAllFriendRequests,
  } = useContext(FriendsContext);

  const [processingFriendReq, setProcessingFriendReq] = useState(false);

  async function handleFriendRequest({ docId, hasAccepted }) {
    setProcessingFriendReq(true);
    await updateFriendRequestStatus(docId, hasAccepted)
      .then((res) => {
        if (res.ok) {
          toast({ title: "Accepted friend request" });
        } else {
          toast({
            title: "Unexpected error accepting request",
            variant: "destructive",
          });
        }
      })
      .catch((err) => {
        toast({
          title: "Unexpected error",
          description: err.message || "",
          variant: "destructive",
        });
      });
    setProcessingFriendReq(false);
  }

  return (
    <div>
      <div className="flex xs:flex-row flex-col xs:items-center xs:justify-between gap-x-4 gap-y-2 mb-4">
        <h1 className="font-semibold text-4xl">Friends</h1>
        <AddFriend triggerVariant={"default"} isLoggedIn={isLoggedIn} />
      </div>
      {loadingUser && loadingAllFriendRequests && (
        <div className="flex flex-col gap-4">
          <Shimmer className="md:w-1/5 w-1/2" />
          <Shimmer className="md:3/4" />
          <Shimmer className="md:3/4" />
          {/* <Shimmer className="md:w-1/5 w-1/2" />
          <Shimmer className="md:3/4" />
          <Shimmer className="md:3/4" /> */}
        </div>
      )}
      {!user && !loadingUser && <div>Login to view alerts :3</div>}
      {user && !loadingAllFriendRequests && (
        <div>
          <div>
            {sentRequests?.length > 0 && (
              <div className="mt-6 flex flex-col gap-2">
                <div className="font-semibold text-lg">Sent Requests</div>
                {sentRequests.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="p-2 px-4 border border-gray-300 rounded-lg overflow-hidden">
                      <div>
                        <p>
                          Friend request sent to{" "}
                          <span className="font-semibold">{item.to}</span>
                        </p>
                        <div className="flex gap-2 text-sm">
                          <span>Status</span>
                          <span>-</span>
                          <span>Pending</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <FriendRequests
            friendRequests={friendRequests}
            processingFriendReq={processingFriendReq}
            handleFriendRequest={handleFriendRequest}
          />
          <FriendList friends={friends} />
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
