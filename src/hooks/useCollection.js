import { useLoginState } from "@/context/login-context";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

function useCollection(queryRef) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(true);

  const { user } = useLoginState(); // Get the authenticated user

  useEffect(() => {
    if (user && queryRef) {
      function getSnapshotOf(observer) {
        return onSnapshot(queryRef, observer);
      }

      const observer = (querySnapshot) => {
        let tempData = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          tempData = [...tempData, docData];
        });
        setData(tempData);
        setIsLoading(false);
      };

      const unsubscribe = getSnapshotOf(observer);

      // Return a cleanup function to unsubscribe when the component unmounts
      return () => unsubscribe();
    }
  }, [user, queryRef]);

  return { data, isLoading };
}

export default useCollection;
