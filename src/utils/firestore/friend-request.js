import {
  doc,
  getDocs,
  or,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import {
  auth,
  db,
  friendRequestCollectionRef,
  FRIEND_REQUEST_COLLECTION,
  userCollectionRef,
} from "../firebase";

export async function sendFriendRequest(friendUserEmailOrId) {
  // Get the current user
  const currentUser = auth.currentUser;
  if (currentUser) {
    //  to check if already friends or has already sent friend request
    if (
      friendUserEmailOrId === currentUser.email ||
      friendUserEmailOrId === currentUser.uid
    ) {
      throw new Error("Cannot send friend request to yourself.");
    }

    const friendRequestQuery = query(
      friendRequestCollectionRef,
      or(
        where("from", "==", currentUser.email),
        where("to", "==", currentUser.email)
      ),
      orderBy("updatedAt", "desc")
    );

    let alreadyFriends;
    let alreadySentFriendRequest;
    const friendRequestSnapshot = await getDocs(friendRequestQuery);
    if (friendRequestSnapshot.empty) {
      alreadyFriends = false;
      alreadySentFriendRequest = false;
    } else {
      for (let i = 0; i < friendRequestSnapshot.docs?.length; i++) {
        const { from, fromUserId, to, toUserId, hasAccepted } =
          friendRequestSnapshot.docs[i].data();
        if (
          from === friendUserEmailOrId ||
          to === friendUserEmailOrId ||
          fromUserId === friendUserEmailOrId ||
          toUserId === friendUserEmailOrId
        ) {
          if (hasAccepted === true) {
            alreadyFriends = true;
          } else if (hasAccepted === null) {
            alreadySentFriendRequest = true;
          }
          break;
        }
      }
    }

    if (alreadyFriends) {
      throw new Error(
        "You guys are already friends! Can't send friend request again."
      );
    }
    if (alreadySentFriendRequest) {
      throw new Error("Already sent friend request.");
    }

    // try to find friend
    const queryByEmailOrUserId = query(
      userCollectionRef,
      or(
        where("email", "==", friendUserEmailOrId),
        where("userId", "==", friendUserEmailOrId)
      )
    );
    const querySnapshotByEmailOrUserId = await getDocs(queryByEmailOrUserId);

    let friendEmail, friendUserId, friendPhotoUrl, friendDisplayName;

    if (!querySnapshotByEmailOrUserId.empty) {
      querySnapshotByEmailOrUserId.forEach((doc) => {
        const { userId, email, photoUrl, displayName } = doc.data();
        if (email === friendUserEmailOrId || userId === friendUserEmailOrId) {
          friendUserId = userId;
          friendEmail = email;
          friendPhotoUrl = photoUrl;
          friendDisplayName = displayName;
        }
      });
    }

    if (!friendUserId || !friendEmail) {
      throw new Error("Friend not found, please check the email or user id");
    }

    // Create a new alert document with the specified fields
    const currentTime = Timestamp.now();
    const newFriendRequestDoc = {
      id: uuidv4(),
      toUserId: friendUserId,
      to: friendEmail, // User's email or UID
      toPhotoUrl: friendPhotoUrl,
      toDisplayName: friendDisplayName,
      fromPhotoUrl: currentUser.photoURL,
      fromDisplayName: currentUser.displayName,
      fromUserId: currentUser.uid,
      from: currentUser.email, // Current user's email (you can use UID if preferred)
      hasAccepted: null, // Initialize hasAccepted as null for a pending request
      createdAt: currentTime,
      updatedAt: currentTime,
    };

    // Add the new alert document to the "Alert" collection
    const friendRequestDocRef = doc(
      friendRequestCollectionRef,
      newFriendRequestDoc.id
    );
    await setDoc(friendRequestDocRef, newFriendRequestDoc);
    console.log("Friend request sent and document created.");

    return { ok: true, message: "Friend request sent." };
  } else {
    console.log("No user is currently logged in.");
    throw new Error("Invalid request, User not logged in.");
  }
}

export async function updateFriendRequestStatus(docId, hasAccepted) {
  try {
    const currentTime = Timestamp.now();

    const friendReqDocRef = doc(db, FRIEND_REQUEST_COLLECTION, docId);

    // Set the "capital" field of the city 'DC'
    await updateDoc(friendReqDocRef, {
      updatedAt: currentTime,
      hasAccepted,
    });

    return {
      ok: true,
      message: `Friend request ${hasAccepted ? "accepted" : "rejected"}.`,
    };
  } catch (error) {
    console.error("Error updating friend request document: ", error);
    throw new Error("Failed to update the friend request.");
  }
}
