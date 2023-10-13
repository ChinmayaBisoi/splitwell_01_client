import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EyeClose from "./icons/EyeClose";
import EyeOpen from "./icons/EyeOpen";
import { useToast } from "./ui/use-toast";
import login from "@/pages/api/auth/login";
import { useRouter } from "next/navigation";
import { useLoginState, useLoginStateDispatch } from "@/context/login-context";
import register from "@/pages/api/auth/register";

const eyeIconClass = "mr-2 cursor-pointer";

const initialFormState = {
  email: "",
  password: "",
  showPassword: false,
  password2: "",
  showPassword2: false,
};

function isValidRequest({ email, password, password2, type = "login" }) {
  if (!email) {
    return "Email is required";
  } else if (!password) {
    return "Paswword is required";
  } else if (type === "register" && password2 !== password) {
    return "Passwords do not match";
  }
}

const AuthForm = ({ type = "login" }) => {
  const loginStateDispatch = useLoginStateDispatch();
  const { isLoggedIn } = useLoginState();

  const router = useRouter();
  const { toast } = useToast();
  const [{ email, password, showPassword, password2, showPassword2 }, setForm] =
    useState(initialFormState);

  const isLoginForm = type === "login";

  function handleChange(e) {
    setForm((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function toggleShowPassword(name) {
    setForm((prev) => {
      return { ...prev, [name]: !prev[name] };
    });
  }

  async function handleLogin() {
    //
    const errMsg = isValidRequest({ email, password });
    if (errMsg) {
      toast({
        title: errMsg,
        description: "",
        variant: "destructive",
      });
      return;
    }

    await login({ email, password })
      .then((res) => {
        console.log(res);
        if (res.ok) {
          //
          loginStateDispatch({
            type: "login",
            email: res.email,
            userId: res.userId,
            friends: res.friends,
            firstName: res.firstName,
            lastName: res.lastName,
          });
          toast({
            title: "Login successful",
            description: "",
          });
          router.push("/");
          return;
        } else {
          toast({
            title: res.message,
            description: "",
            variant: "destructive",
          });
        }
      })
      .catch(() => {
        toast({
          title: "Unexpected Error",
          description: "",
          variant: "destructive",
        });
      });
  }

  async function handleRegister() {
    //
    const errMsg = isValidRequest({
      email,
      password,
      password2,
      type: "register",
    });
    if (errMsg) {
      toast({
        title: errMsg,
        description: "",
        variant: "destructive",
      });
      return;
    }

    await register({ email, password })
      .then((res) => {
        console.log(res);
        if (res.ok) {
          //
          toast({
            title: "User created successfully",
            description: "",
          });
          router.push("/login");
          return;
        } else {
          toast({
            title: res.message,
            description: "",
            variant: "destructive",
          });
        }
      })
      .catch(() => {
        toast({
          title: "Unexpected Error",
          description: "",
          variant: "destructive",
        });
      });
  }

  return (
    <div className="flex items-center justify-center grow">
      <div className="border border-gray-200 rounded-md p-4 flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            className="outline-none"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="flex items-center border border-gray-200 rounded-md">
            <Input
              id="password"
              name="password"
              className="border-none outline-none"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handleChange}
            />
            {showPassword ? (
              <EyeOpen
                onClick={() => {
                  toggleShowPassword("showPassword");
                }}
                className={eyeIconClass}
              />
            ) : (
              <EyeClose
                onClick={() => {
                  toggleShowPassword("showPassword");
                }}
                className={eyeIconClass}
              />
            )}
          </div>
        </div>
        {!isLoginForm && (
          <div>
            <Label htmlFor="password2">Confirm password</Label>
            <div className="flex items-center border border-gray-200 rounded-md">
              <Input
                id="password2"
                name="password2"
                className="border-none outline-none"
                type={showPassword2 ? "text" : "password"}
                value={password2}
                onChange={handleChange}
              />
              {showPassword2 ? (
                <EyeOpen
                  onClick={() => {
                    toggleShowPassword("showPassword2");
                  }}
                  className={eyeIconClass}
                />
              ) : (
                <EyeClose
                  onClick={() => {
                    toggleShowPassword("showPassword2");
                  }}
                  className={eyeIconClass}
                />
              )}
            </div>
          </div>
        )}
        <div className="flex items-center text-sm">
          {isLoginForm ? (
            <p>Don&apos;t have an account?</p>
          ) : (
            <p>Already have an account?</p>
          )}
          <Link
            href={isLoginForm ? "/register" : "/login"}
            className="font-semibold px-2 py-1 ml-1 hover:bg-gray-200 rounded-md underline">
            {isLoginForm ? "Register" : "Login"}
          </Link>
        </div>
        {isLoginForm ? (
          <Button className="" disabled={isLoggedIn} onClick={handleLogin}>
            Login
          </Button>
        ) : (
          <Button className="" disabled={isLoggedIn} onClick={handleRegister}>
            Register
          </Button>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
