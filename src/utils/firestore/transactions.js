import { doc, getDoc, runTransaction, Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import {
  auth,
  balanceCollectionRef,
  db,
  transactionCollectionRef,
} from "../firebase";

export async function addNewExpense(expense, groupId) {
  // Get the current user
  const currentUser = auth.currentUser;
  if (currentUser) {
    //  to check if already friends or has already sent friend request
    if (!expense || !groupId) {
      throw new Error("Insufficient data");
    }

    const expenseForBalanceCalc = structuredClone(expense);

    const uuid = uuidv4();

    const currentTime = Timestamp.now();
    const transactionData = {
      uuid,
      groupId,
      ...expense,
      createdAt: currentTime,
      updatedAt: currentTime,
      // You can add more user-related data here
    };

    const balanceData = {
      groupId,
      expenseMap: expenseForBalanceCalc.expenseMap,
    };

    await runTransaction(db, async (transaction) => {
      const transactionDocRef = doc(
        transactionCollectionRef,
        transactionData.uuid
      );

      const balanceDocRef = doc(balanceCollectionRef, balanceData.groupId);

      const balanceDocData = await getDoc(balanceDocRef);

      if (balanceDocData.exists()) {
        const sign = expense.type === "settle_up" ? -1 : +1;
        const oldBalanceData = balanceDocData.data();
        const oldBalanceDataExpenseMap = oldBalanceData.expenseMap;
        for (let key in oldBalanceDataExpenseMap) {
          if (balanceData.expenseMap[key] === undefined) {
            balanceData.expenseMap[key] = {};
          }
          for (let key2 in oldBalanceDataExpenseMap[key]) {
            if (balanceData.expenseMap[key][key2] !== undefined) {
              if (sign > 0) {
                balanceData.expenseMap[key][key2] +=
                  oldBalanceDataExpenseMap[key][key2];
              } else {
                balanceData.expenseMap[key][key2] -=
                  oldBalanceDataExpenseMap[key][key2];
              }
            } else {
              balanceData.expenseMap[key][key2] =
                oldBalanceDataExpenseMap[key][key2];
            }
          }
        }
        transaction.update(balanceDocRef, balanceData);
      } else {
        transaction.set(balanceDocRef, balanceData);
      }

      transaction.set(transactionDocRef, transactionData);
    });

    return { ok: true, message: "Expense added" };
  } else {
    console.log("No user is currently logged in.");
    throw new Error("Invalid request, User not logged in.");
  }
}

export async function deleteTransaction(transaction, groupId) {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const transactionId = transaction.uuid;
    const expenseMap = structuredClone(transaction.expenseMap);
    //  to check if already friends or has already sent friend request
    if (!transactionId || !groupId) {
      throw new Error("Insufficient data");
    }

    const balanceData = {
      groupId,
      expenseMap,
    };

    await runTransaction(db, async (transaction) => {
      const transactionDocRef = doc(transactionCollectionRef, transactionId);
      transaction.delete(transactionDocRef);

      const balanceDocRef = doc(balanceCollectionRef, balanceData.groupId);
      const balanceDocData = await getDoc(balanceDocRef);

      if (balanceDocData.exists()) {
        const oldBalanceData = balanceDocData.data();
        const oldBalanceDataExpenseMap = oldBalanceData.expenseMap;
        for (let key in oldBalanceDataExpenseMap) {
          if (balanceData.expenseMap[key] === undefined) {
            balanceData.expenseMap[key] = {};
          }
          for (let key2 in oldBalanceDataExpenseMap[key]) {
            if (balanceData.expenseMap[key][key2] !== undefined) {
              balanceData.expenseMap[key][key2] -=
                oldBalanceDataExpenseMap[key][key2];
            } else {
              balanceData.expenseMap[key][key2] =
                oldBalanceDataExpenseMap[key][key2];
            }
          }
        }
        transaction.update(balanceDocRef, balanceData);
      }
    });

    return { ok: true, message: "Transaction deleted" };
  } else {
    console.log("No user is currently logged in.");
    throw new Error("Invalid request, User not logged in.");
  }
}
