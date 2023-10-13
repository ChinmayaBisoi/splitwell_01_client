import LaughIcon from "@/components/icons/LaughIcon";
import Shimmer from "@/components/Shimmer";
import { Button } from "@/components/ui/button";
import { useLoginState } from "@/context/login-context";
import useCollection from "@/hooks/useCollection";
import { alertCollectionRef, ALERT_COLLECTION, db } from "@/utils/firebase";
import {
  collection,
  limit,
  onSnapshot,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

const AlertsPage = () => {
  const { isLoggedIn, loading: loadingUser, user } = useLoginState();
  const [alertQuery, setAlertQuery] = useState(null);
  const { data: alerts, isLoading: loadingAlerts } = useCollection(alertQuery);

  useEffect(() => {
    if (!user) return;
    setAlertQuery(
      query(
        alertCollectionRef,
        or(
          where("fromUserId", "==", user.userId),
          where("toUserId", "==", user.userId)
        ),
        orderBy("updatedAt", "desc"),
        limit(200)
      )
    );
  }, [user]);

  return (
    <div>
      <h1 className="font-semibold text-4xl mb-4">Alerts</h1>
      {loadingUser && <Shimmer className="" />}
      {!user && !loadingUser && <div>Login to view alerts :3</div>}
      {user && alerts?.length === 0 && <div>No alerts present</div>}
      {user && alerts?.length > 0 && (
        <div className="flex flex-col gap-4">
          {alerts.map((alert) => {
            return (
              <div
                key={alert.id}
                className="p-4 border border-gray-300 rounded-lg ">
                {alert.type === "friend_request" && (
                  <div className="flex gap-2 xs:flex-row flex-col">
                    <LaughIcon className="text-green-700 min-w-[24px]" />
                    <div>
                      <p>
                        <span className="font-semibold">{alert.from}</span> has
                        sent a friend request
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" className="">
                          Accept
                        </Button>
                        <Button size="sm">Reject</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
