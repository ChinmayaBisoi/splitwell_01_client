import { BACKEND_HOST } from "@/constants/env";

export default async function getAllTodos() {
  try {
    const response = await fetch(`${BACKEND_HOST}/todos/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://cbi-todo-app.vercel.app",
      },
      credentials: "include",
      mode: "cors",
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
  return {};
}
