import React from "react";
import { Button } from "../ui/button";

const FriendRequests = ({
  friendRequests = [],
  handleFriendRequest = () => {},
  processingFriendReq = false,
}) => {
  return (
    <div>
      {friendRequests?.length > 0 && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="font-semibold text-lg">Friend Requests</div>
          {friendRequests.map((item) => {
            return (
              <div
                key={item.id}
                className="p-2 px-4 pb-3 border border-gray-300 rounded-lg overflow-hidden">
                <div>
                  <p>
                    <span className="font-semibold">{item.from}</span> has sent
                    a friend request.
                  </p>
                  <div className="flex gap-3 mt-1">
                    <Button
                      disabled={
                        item.hasAccepted !== null || processingFriendReq
                      }
                      loading={processingFriendReq}
                      onClick={() => {
                        handleFriendRequest({
                          docId: item.id,
                          hasAccepted: true,
                        });
                      }}
                      size="sm"
                      className="py-0 px-4">
                      Accept
                    </Button>
                    <Button
                      disabled={
                        item.hasAccepted !== null || processingFriendReq
                      }
                      loading={processingFriendReq}
                      onClick={() => {
                        handleFriendRequest({
                          docId: item.id,
                          hasAccepted: false,
                        });
                      }}
                      size="sm"
                      className="py-0 px-4">
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
