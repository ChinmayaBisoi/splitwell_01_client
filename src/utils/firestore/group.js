import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { auth, groupCollectionRef, userCollectionRef } from "../firebase";
import { sendFriendRequest } from "./friend-request";

export function getGroupQueryRef(user) {
  const queryRef = query(
    groupCollectionRef,
    where("userId", "==", user.userId),
    orderBy("updatedAt", "desc")
  );
  return queryRef;
}

export function getGroupByIdQueryRef(groupId) {
  const queryRef = query(
    groupCollectionRef,
    where("groupId", "==", groupId),
    where("isActive", "==", true),
    orderBy("updatedAt", "desc")
  );
  return queryRef;
}

export async function createGroup({
  name = "",
  description = "",
  baseGroup = null,
  friendEmail = "",
}) {
  // Get the current user
  const currentUser = auth.currentUser;
  if (currentUser) {
    if (!name && !baseGroup) {
      throw new Error("Group Name is a required field.");
    }

    let friendUserId, friendDisplayName, friendPhotoUrl;
    if (baseGroup) {
      // to send group invite ie to add someone else to group
      // check if user already belong to that group

      const queryRef = query(
        groupCollectionRef,
        where("userEmail", "==", friendEmail),
        where("groupId", "==", baseGroup.groupId)
      );
      const querySnapshot = await getDocs(queryRef);

      let alreadySentGroupInvite;
      querySnapshot.forEach((doc) => {
        const { isActive } = doc.data();
        if (isActive !== false) {
          alreadySentGroupInvite = true;
        }
      });

      if (alreadySentGroupInvite) {
        throw new Error("Already sent group invite.");
      }

      const usersqueryRef = query(
        userCollectionRef,
        where("email", "==", friendEmail)
      );
      const usersquerySnapshot = await getDocs(usersqueryRef);

      if (!usersquerySnapshot.empty) {
        usersquerySnapshot.forEach((doc) => {
          const { userId, email, photoUrl, displayName } = doc.data();
          if (email === friendEmail) {
            friendUserId = userId;
            friendDisplayName = displayName;
            friendPhotoUrl = photoUrl;
          }
        });
      }

      if (!friendUserId) {
        throw new Error(`User with email ${friendEmail} does not exist`);
      }

      // await sendFriendRequest(friendUserId);
    }

    // Create a new alert document with the specified fields
    const currentTime = Timestamp.now();
    const groupDoc = {
      groupId: baseGroup ? baseGroup.groupId : uuidv4(),
      userId: baseGroup ? friendUserId : currentUser.uid,
      userEmail: baseGroup ? friendEmail : currentUser.email,
      userDisplayName: baseGroup ? friendDisplayName : currentUser.displayName,
      userPhotoUrl: baseGroup ? friendPhotoUrl : currentUser.photoURL,
      ownerId: baseGroup ? baseGroup.ownerId : currentUser.uid,
      ownerEmail: baseGroup ? baseGroup.ownerEmail : currentUser.email,
      ownerDisplayName: baseGroup
        ? baseGroup.ownerDisplayName
        : currentUser.displayName,
      ownerPhotoUrl: baseGroup ? baseGroup.ownerPhotoUrl : currentUser.photoURL,
      role: baseGroup ? "member" : "owner",
      name: baseGroup ? baseGroup.name : name,
      description: baseGroup ? baseGroup.description : description,
      isActive: baseGroup ? null : true, // isActive null means that group invite was sent but receiver has not responded
      isDeleted: false,
      createdAt: currentTime,
      updatedAt: currentTime,
    };

    // Add the new alert document to the "Alert" collection
    await addDoc(groupCollectionRef, groupDoc);

    return {
      ok: true,
      message: baseGroup ? "Group Invite Sent" : "Group created.",
    };
  } else {
    throw new Error("Invalid request, User not logged in.");
  }
}

export async function handleGroupInviteResponse({ response, group }) {
  const currentUser = auth.currentUser;
  if (currentUser) {
    if (!response || !group) {
      throw new Error("Insufficient data.");
    }

    const groupqueryRef = query(
      groupCollectionRef,
      where("userEmail", "==", group.userEmail),
      where("groupId", "==", group.groupId)
    );
    const groupquerySnapshot = await getDocs(groupqueryRef);
    const docId = groupquerySnapshot.docs[0].id;

    // if (!groupquerySnapshot.empty) {
    //   groupquerySnapshot.forEach((doc) => {
    //     groupDocDetails = doc.data();
    //   });
    // }

    if (!docId) {
      throw new Error(`Unexpected error`);
    }

    const currentTime = Timestamp.now();
    const groupDoc = {
      isActive: response, // isActive null means that group invite was sent but receiver has not responded
      updatedAt: currentTime,
    };

    // Add the new alert document to the "Alert" collection
    await updateDoc(doc(groupCollectionRef, docId), {
      ...groupDoc,
    });

    return {
      ok: true,
      message: "Joined group.",
    };
  } else {
    console.log("No user is currently logged in.");
    throw new Error("Invalid request, User not logged in.");
  }
}

export async function deleteGroup(groupId) {
  try {
    // Get a reference to the group document using the groupId
    const groupDocRef = doc(groupCollectionRef, groupId);
    console.log(await getDoc(groupDocRef));
    // Update the isDeleted field to true
    return;
    await updateDoc(groupDocRef, {
      isDeleted: true,
    });

    console.log(`Group with ID ${groupId} has been deleted.`);

    return { ok: true, message: `Group with ID ${groupId} has been deleted.` };
  } catch (error) {
    console.error("Error deleting group: ", error);
    throw new Error("Failed to delete the group.");
  }
}
