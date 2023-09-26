import Link from "next/link";
import { Button } from "./ui/button";

const Login = () => {
  return (
    <Link href="/login">
      <Button>Login</Button>
    </Link>
  );
};

export default Login;
