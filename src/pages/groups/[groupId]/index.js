import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLoginState } from "@/context/login-context";
import { Button } from "@/components/ui/button";
import { AddFriend } from "@/components/groups/AddFriend";
import { getGroupByIdQueryRef } from "@/utils/firestore/group";
import useCollection from "@/hooks/useCollection";
import Shimmer from "@/components/Shimmer";
import AddExpense from "@/components/groups/AddExpense";
import Members from "@/components/groups/GroupSettings";
import GroupSettings from "@/components/groups/GroupSettings";
import { orderBy, query, where } from "firebase/firestore";
import {
  balanceCollectionRef,
  transactionCollectionRef,
} from "@/utils/firebase";
import ExpenseTransaction from "@/components/groups/ExpenseTransaction";
import SettleUp from "@/components/groups/SettleUp";
import SettledTransaction from "@/components/groups/SettledTransaction";

const GroupDetailsPage = () => {
  const { query: routerQuery } = useRouter();
  const groupId = routerQuery.groupId;

  const { isLoggedIn, user, loading: isLoadingUser } = useLoginState();
  const [groupQuery, setGroupQuery] = useState(null);
  const [transactionQuery, setTransactionQuery] = useState(null);
  const [balancesQuery, setBalancesQuery] = useState(null);

  const { data: groupDetails, isLoading: isLoadingGroup } =
    useCollection(groupQuery);

  const { data: transactions, isLoading: isLoadingTransactions } =
    useCollection(transactionQuery);

  const { data: balances, isLoading: isLoadingBalances } =
    useCollection(balancesQuery);

  const canUserAccess = (groupDetails || []).find(
    (k) => k.userEmail === user?.email
  );
  const group = canUserAccess ? groupDetails[0] : null;
  const groupNotFound =
    !isLoadingUser && isLoggedIn && !isLoadingGroup && !group;

  async function fetchGroupDetails() {
    if (!user || !groupId) return;

    const groupQueryRef = getGroupByIdQueryRef(groupId);
    setGroupQuery(groupQueryRef);
    setTransactionQuery(
      query(
        transactionCollectionRef,
        where("groupId", "==", groupId),
        orderBy("createdAt", "desc")
      )
    );
    setBalancesQuery(
      query(balanceCollectionRef, where("groupId", "==", groupId))
    );
  }

  useEffect(() => {
    fetchGroupDetails();
  }, [user, groupId]);

  useEffect(() => {
    console.log(group, transactions, balances);
  });

  return (
    <div>
      {isLoadingUser && (
        <div className="flex flex-col gap-8">
          <Shimmer className="w-1/2" />
          <Shimmer />
        </div>
      )}
      {!isLoadingUser && !isLoggedIn && <h2>Login to view group details.</h2>}
      {groupNotFound && <div>Group not found</div>}
      {user && group && transactions && balances && (
        <>
          <h2 className={`text-4xl font-semibold mb-4`}>{group?.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 whitespace-nowrap mb-4">
            <AddExpense groupDetails={groupDetails} user={user} />
            <SettleUp
              balances={balances}
              user={user}
              groupDetails={groupDetails}
            />
            {/* <Button size="sm" variant="secondary" className="">
              Balances
            </Button>
            <Button size="sm" variant="secondary" className="">
              Charts
            </Button> */}
            <AddFriend group={group} isLoggedIn={isLoggedIn} />
            <GroupSettings groupDetails={groupDetails} />
          </div>
          <div className="divide-y mb-4">
            {balances.length > 0 && (
              <div>
                {balances.map((balance) => {
                  const balanceExpenseMapForUser =
                    balance.expenseMap[user.email];
                  return (
                    <div key={balance.groupId}>
                      {Object.keys(balanceExpenseMapForUser).map((k) => {
                        const amount = balanceExpenseMapForUser[k];
                        const otherParty = groupDetails.find(
                          (m) => m.userEmail === k
                        );
                        return (
                          <div key={k} className="font-medium">
                            {amount > 0 && (
                              <p className="text-red-700">
                                {"> "}You owe {otherParty?.userDisplayName} Rs.
                                {Math.abs(amount).toFixed(2)}
                              </p>
                            )}
                            {amount < 0 && (
                              <p className="text-emerald-700">
                                {"> "}
                                {otherParty?.userDisplayName} owes you Rs.
                                {Math.abs(amount).toFixed(2)}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="divide-y">
            {transactions.length > 0 ? (
              transactions.map((transaction) => {
                if (transaction.type !== "settle_up") {
                  return (
                    <ExpenseTransaction
                      key={transaction.uuid}
                      user={user}
                      transaction={transaction}
                    />
                  );
                } else {
                  return (
                    <SettledTransaction
                      key={transaction.uuid}
                      user={user}
                      transaction={transaction}
                    />
                  );
                }
              })
            ) : (
              <div className="mt-8 flex flex-col gap-4">
                <p>No transactions available.</p>
                <p>
                  Invite your friends to this group and add an expense to view
                  transactions here.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GroupDetailsPage;
