import Link from "next/link";
import { Button } from "./ui/button";

const Register = () => {
  return (
    <Link href="/register">
      <Button>Register</Button>
    </Link>
  );
};

export default Register;
