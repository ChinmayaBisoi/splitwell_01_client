import { BACKEND_HOST } from "@/constants/env";

export default async function getTodoById({ postId }) {
  try {
    const response = await fetch(`${BACKEND_HOST}/todos/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://cbi-todo-app.vercel.app",
      },
      redirect: "follow",
      credentials: "include",
      mode: "cors",
    });

    return await response.json();
  } catch (error) {
    console.log(error);
  }
  return {};
}
