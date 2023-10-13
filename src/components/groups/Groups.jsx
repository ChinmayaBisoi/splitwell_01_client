import { useGroupState } from "@/context/group-context";
import { useLoginState } from "@/context/login-context";
import useCollection from "@/hooks/useCollection";
import { groupCollectionRef } from "@/utils/firebase";
import { getGroupQueryRef } from "@/utils/firestore/group";
import { orderBy, query, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import Shimmer from "../Shimmer";
import { Button } from "../ui/button";
import { CreateGroup } from "./CreateGroup";
import PendingGroupRequest from "./PendingGroupRequest";

const Groups = () => {
  const [groupQuery, setGroupQuery] = useState(null);
  const { isLoggedIn, user, loading: isLoading } = useLoginState();
  const { data: allGroups, isLoading: isLoadingGroups } =
    useCollection(groupQuery);

  const activeGroups = allGroups.filter((k) => k.isActive);
  const pendingGroups = allGroups.filter((k) => k.isActive === null);

  useEffect(() => {
    if (!user) return;
    const queryRef = getGroupQueryRef(user);
    setGroupQuery(queryRef);
  }, [user]);

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex xs:flex-row flex-col xs:items-center xs:justify-between gap-x-4 gap-y-2 mb-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold">Groups</h1>
          <h3 className="text-gray-500">Create and manage groups.</h3>
        </div>
        <CreateGroup isLoggedIn={isLoggedIn} />
      </div>
      <div>
        <div className="">
          {!isLoggedIn && !isLoading && (
            <h2 className="text-xl font-semibold mb-4">
              Login to view your groups
            </h2>
          )}
          {isLoading && isLoadingGroups && (
            <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
              {new Array(3).fill(null).map((_, index) => {
                return (
                  <Shimmer
                    key={index}
                    className={"md:col-span-1 col-span-full h-40"}
                  />
                );
              })}
            </div>
          )}
          {isLoggedIn && !isLoadingGroups && pendingGroups.length > 0 && (
            <>
              <h2 className="mb-4 text-xl font-medium">
                {"> "}Pending Requests
              </h2>
              <div className="flex flex-col gap-8 mb-8">
                {pendingGroups.map((group) => {
                  return (
                    <PendingGroupRequest key={group.groupId} group={group} />
                  );
                })}
              </div>
            </>
          )}
          {isLoggedIn && !isLoadingGroups && activeGroups.length > 0 && (
            <>
              <h2 className="mb-2 text-xl font-medium">{"> "}Active Groups</h2>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
                {activeGroups.map(
                  ({ groupId, name, description, ownerEmail }) => {
                    return (
                      <Link
                        href={`/groups/${groupId}`}
                        key={groupId}
                        className="p-4 md:col-span-1 col-span-full rounded-md border border-gray-200 hover:shadow hover:bg-gray-100 overflow-hidden">
                        <p className="font-semibold">{name}</p>
                        {description && (
                          <>
                            <p className="mt-2 text-sm font-semibold">
                              Description
                            </p>
                            <p className="text-xs">{description}</p>
                          </>
                        )}
                        <p className="mt-2 text-sm font-semibold">Owner</p>
                        <p className="text-xs">{ownerEmail}</p>
                      </Link>
                    );
                  }
                )}
              </div>
            </>
          )}
          {isLoggedIn && !isLoadingGroups && activeGroups.length === 0 && (
            <p className="font-medium text-xl">
              {"> "}Create or join group to view active Groups.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Groups;
