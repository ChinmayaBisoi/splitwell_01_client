import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { FriendsContextProvider } from "@/context/friends-context";
import { GroupStateProvider } from "@/context/group-context";
import {
  LoginStateProvider,
  useLoginStateDispatch,
} from "@/context/login-context";
import "@/styles/globals.css";
import { auth, getOrCreateUser } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Poppins } from "next/font/google";
import Head from "next/head";
import { useEffect } from "react";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

function Wrapper({ Component, pageProps }) {
  const loginStateDispatch = useLoginStateDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await getOrCreateUser(currentUser)
          .then((user) => {
            loginStateDispatch({ type: "login", user });
          })
          .catch((err) => {
            toast({
              title: "Unexpected error while logging in.",
              description: err.message || "",
              variant: "destructive",
            });
          });
      } else {
        // user not logged in
        loginStateDispatch({ type: "logout" });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div className={`${poppins.className}`}>
      <Head>
        <title>Splitwell | Your Expense Tracker</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster />
    </div>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <LoginStateProvider>
      <FriendsContextProvider>
        <GroupStateProvider>
          <Wrapper Component={Component} pageProps={pageProps} />
        </GroupStateProvider>
      </FriendsContextProvider>
    </LoginStateProvider>
  );
}
