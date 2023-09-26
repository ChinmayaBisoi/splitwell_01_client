import { BACKEND_HOST } from "@/constants/env";

export default async function deleteTodo({ todoId }) {
  try {
    const response = await fetch(`${BACKEND_HOST}/todos/${todoId}`, {
      method: "DELETE",
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
