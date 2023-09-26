import { BACKEND_HOST } from "@/constants/env";

export default async function updateTodo({ title, description, id }) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ title, description, id });

    const response = await fetch(`${BACKEND_HOST}/todos`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://cbi-todo-app.vercel.app",
      },
      headers: myHeaders,
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
