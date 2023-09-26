import { BACKEND_HOST } from "@/constants/env";

export default async function register({ email, password }) {
  try {
    const raw = JSON.stringify({ email, password });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://cbi-todo-app.vercel.app",
      },
      body: raw,
      redirect: "follow",
      credentials: "include",
      mode: "cors",
    };

    const response = await fetch(`${BACKEND_HOST}/auth/signup`, requestOptions);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
  return {};
}
