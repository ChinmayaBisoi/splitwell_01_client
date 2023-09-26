import { BACKEND_HOST } from "@/constants/env";

export default async function addTodo({
  title,
  description,
  isChecked = false,
}) {
  try {
    const raw = JSON.stringify({ title, description, isChecked });

    const response = await fetch(`${BACKEND_HOST}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://cbi-todo-app.vercel.app",
      },
      body: raw,
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
