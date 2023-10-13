import { useLoginState } from "@/context/login-context";
import { auth } from "@/utils/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import Shimmer from "./Shimmer";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import UserProfileDropdown from "./UserProfileDropdown";

const Login = () => {
  const { isLoggedIn, user, loading } = useLoginState();

  async function googleSignIn() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function handleLogin() {
    await googleSignIn().catch((err) => {
      toast({
        title: "Unexpected error, try again.",
        description: err.message || "",
        variant: "destructive",
      });
    });
  }

  async function handleLogout() {
    await signOut(auth)
      .then((res) => {
        //
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      {loading ? (
        <Shimmer className={"h-10 w-20"} />
      ) : isLoggedIn ? (
        <UserProfileDropdown user={user} handleLogout={handleLogout} />
      ) : (
        <Button onClick={handleLogin}>Login</Button>
      )}
    </>
  );
};

export default Login;
