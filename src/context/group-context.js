import useCollection from "@/hooks/useCollection";
import { getGroupQueryRef } from "@/utils/firestore/group";
import { orderBy, query, where } from "firebase/firestore";
import * as React from "react";
import { useLoginState } from "./login-context";

const initialGroupState = {
  allGroups: [],
  isLoading: false,
  activeGroups: [],
  pendingGroups: [],
};
export const GroupStateContext = React.createContext(initialGroupState);

export function GroupStateProvider({ children }) {
  const [groupQuery, setGroupQuery] = React.useState(null);
  const { user } = useLoginState();
  const { data: allGroups, isLoading } = useCollection(groupQuery);

  const activeGroups = allGroups.filter((k) => k.isActive);
  const pendingGroups = allGroups.filter((k) => k.isActive === null);

  React.useEffect(() => {
    if (!user) return;
    const queryRef = getGroupQueryRef(user);
    setGroupQuery(queryRef);
  }, [user]);

  return (
    <GroupStateContext.Provider
      value={{ allGroups, activeGroups, pendingGroups, isLoading }}>
      {children}
    </GroupStateContext.Provider>
  );
}
