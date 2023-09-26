import { useEffect, useState } from "react";

export default function Test() {
  const [resource, setResource] = useState("posts");

  useEffect(() => {
    console.log("Every render");
  });

  useEffect(() => {
    console.log("Every resource");
  }, [resource]);

  return (
    <div>
      <button
        className="mx-4"
        onClick={() => {
          console.log("clicked");
          setResource((prev) => "posts");
        }}>
        Posts
      </button>
      <button
        className="mx-4"
        onClick={() => {
          console.log("clicked");
          setResource("users");
        }}>
        users
      </button>
      <button
        className="mx-4"
        onClick={() => {
          console.log("clicked");
          setResource("comments");
        }}>
        comments
      </button>
      <div className="mt-4">{resource}</div>
    </div>
  );
}
