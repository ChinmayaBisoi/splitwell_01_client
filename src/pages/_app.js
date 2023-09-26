import "@/styles/globals.css";
import { PostStateProvider } from "@/context/post-context";
import { Toaster } from "@/components/ui/toaster";
import { Poppins } from "next/font/google";
import {
  LoginStateProvider,
  useLoginState,
  useLoginStateDispatch,
} from "@/context/login-context";
import { useEffect } from "react";
import checkAuth from "./api/auth/check-auth";
import { useToast } from "@/components/ui/use-toast";
import Head from "next/head";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

function Wrapper({ Component, pageProps }) {
  const { toast } = useToast();
  const loginState = useLoginState();
  const loginStateDispatch = useLoginStateDispatch();
  const isLoggedIn = loginState.isLoggedIn;

  useEffect(() => {
    if (!isLoggedIn) {
      (async function tryToLogin() {
        await checkAuth().then((res) => {
          if (res.ok) {
            loginStateDispatch({
              type: "login",
              email: res.userInfo.email,
              userId: res.userInfo.id,
            });
            toast({
              title: "Login successfull",
              description: "Automatically logged in <3",
            });
          }
        });
      })();
    }
  }, [isLoggedIn]);
  return (
    <div className={`${poppins.className}`}>
      <Head>
        <title>Splitwell | Your Expense Tracker</title>
      </Head>
      <Component {...pageProps} />
      <Toaster />
    </div>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <LoginStateProvider>
      <PostStateProvider>
        <Wrapper Component={Component} pageProps={pageProps} />
      </PostStateProvider>
    </LoginStateProvider>
  );
}
