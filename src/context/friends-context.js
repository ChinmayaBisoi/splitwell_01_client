import useCollection from "@/hooks/useCollection";
import { friendRequestCollectionRef } from "@/utils/firebase";
import { limit, or, orderBy, query, where } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { useLoginState } from "./login-context";

export const FriendsContext = createContext({
  allFriendRequests: [],
  sentRequests: [],
  friendRequests: [],
  friends: [],
  isLoading: false,
});

export function FriendsContextProvider({ children }) {
  const { user } = useLoginState();
  const [queryForFriendReqs, setAlertQuery] = useState(null);
  const { data: allFriendRequests, isLoading } =
    useCollection(queryForFriendReqs);

  const sentRequests = allFriendRequests.filter(
    (k) => k.hasAccepted === null && k.fromUserId === user?.userId
  );
  const friendRequests = allFriendRequests.filter(
    (k) => k.hasAccepted === null && k.toUserId === user?.userId
  );
  const friends = allFriendRequests
    .filter((k) => k.hasAccepted === true)
    .map((k) => {
      if (k.fromUserId === user?.userId) {
        return {
          ...k,
          displayName: k.toDiplayName,
          photoUrl: k.toPhotoUrl,
          email: k.to,
        };
      } else if (k.toUserId === user?.userId) {
        return {
          ...k,
          displayName: k.fromDiplayName,
          photoUrl: k.fromPhotoUrl,
          email: k.from,
        };
      }
    });

  useEffect(() => {
    if (!user) return;
    setAlertQuery(
      query(
        friendRequestCollectionRef,
        or(where("from", "==", user.email), where("to", "==", user.email)),
        orderBy("updatedAt", "desc"),
        limit(200)
      )
    );
  }, [user]);

  return (
    <FriendsContext.Provider
      value={{
        allFriendRequests,
        sentRequests,
        friendRequests,
        friends,
        isLoading,
      }}>
      {children}
    </FriendsContext.Provider>
  );
}
