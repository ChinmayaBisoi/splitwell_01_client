import { BACKEND_HOST } from "@/constants/env";

export default async function wakeServer() {
  try {
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
      credentials: "include",
      mode: "cors",
    };

    const response = await fetch(`${BACKEND_HOST}`, requestOptions);
    console.log("server woken");
    return await response.json();
  } catch (error) {
    console.log(error);
  }
  return {};
}
