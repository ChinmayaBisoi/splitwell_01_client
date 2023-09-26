import Link from "next/link";
import React, { useEffect, useId, useState } from "react";
import ChevronLeft from "../icons/ChevronLeft";
import { Button } from "../ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePostState, usePostStateDispatch } from "@/context/post-context";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useLoginState } from "@/context/login-context";
import addTodo from "@/pages/api/posts/add-todo";
import updateTodo from "@/pages/api/posts/update-todo";
import getTodoById from "@/pages/api/posts/get-todo-by-id";

const PostLayout = ({ editing = false, postId }) => {
  console.log(postId, ">>>>>>>>>>>><<<<<<<<");
  const router = useRouter();
  const { toast } = useToast();
  const postState = usePostState();
  const postStateDispatch = usePostStateDispatch();

  const loginState = useLoginState();
  const isLoggedIn = loginState.isLoggedIn;

  const [fetchedPost, setFetchedPost] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  let uuid = crypto.randomUUID();

  function initPost() {
    if (!postId) return;
    let foundPost = postState.tempPosts?.find((k) => k.id === postId);
    if (!foundPost) {
      foundPost = postState.savedPosts?.find((k) => postId === k._id);
    }
    if (!foundPost) {
      console.log("here >>>>>>");
      foundPost = fetchedPost;
    }

    if (editing) {
      if (!foundPost) {
        console.log("post not found");
        toast({
          title: "Post not found",
          description: "",
          variant: "destructive",
        });
      } else {
        console.log(foundPost);
        setTitle(foundPost.title);
        setDescription(foundPost.description);
        uuid = foundPost.id;
      }
    }
  }

  useEffect(() => {
    if (!editing) return;
    (async function () {
      await getTodoById({ postId })
        .then((res) => {
          if (res.ok) {
            setFetchedPost(res.post);
          }
        })
        .catch((err) => {
          console.log(err);
          toast({});
        });
    })();
  }, []);

  async function savePost() {
    if (!title) {
      toast({
        title: "Title is required!",
        description: "",
        variant: "destructive",
      });
      return;
    }
    if (!description) {
      toast({
        title: "Description is required!",
        description: "",
        variant: "destructive",
      });
      return;
    }

    if (isLoggedIn) {
      if (editing) {
        await updateTodo({ title, description, id: postId })
          .then((res) => {
            console.log(res);
            if (res.ok) {
              postStateDispatch({
                type: "update-post",
                post: res.todo,
              });
              router.push("/");
            }
          })
          .catch((err) => {
            console.log(err);
            toast({
              title: "Unexpected error updating todo",
              description: err,
              variant: "desctructive",
            });
          });
        return;
      }

      await addTodo({ title, description })
        .then((res) => {
          if (res.ok) {
            const post = res.todo;
            postStateDispatch({
              type: "save-post",
              post: {
                id: post._id,
                title: post.title,
                description: post.description,
                updatedAt: post.updatedAt,
                isChecked: post.isChecked,
              },
            });
            toast({
              title: "Post saved",
              description: "",
            });
            router.push("/");
          }
        })
        .catch((err) => {
          toast({
            title: "Error saving post",
            description: err,
            variant: "desctructive",
          });
        });

      return;
    }

    if (editing) {
      postStateDispatch({
        type: "update-temp-post",
        post: {
          id: postId,
          title,
          description,
        },
      });
      toast({
        title: "Post saved successfully!",
        description: "",
      });
      router.push("/");
      return;
    }

    postStateDispatch({
      type: "save-temp-post",
      post: {
        id: uuid,
        title,
        description,
      },
    });
    toast({
      title: "Post created successfully!",
      description: "",
    });
    router.push("/");
  }

  useEffect(() => {
    initPost();
  }, [postId, fetchedPost]);

  return (
    <div className="md:p-8 p-4 min-h-screen">
      <div className="flex justify-between items-center">
        <Link href={"/"}>
          <Button variant="ghost" className="flex items-center gap-2">
            <ChevronLeft width="16" height="16" />
            <p>Back</p>
          </Button>
        </Link>
        <Button onClick={savePost}>Save</Button>
      </div>
      <div className="mt-10">
        <div className="max-w-[650px] mx-auto flex flex-col gap-4">
          <Textarea
            id="title"
            autoResizable
            value={title}
            placeholder={"Untitled Post"}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="text-2xl focus-visible:ring-0 focus-visible:ring-offset-0 border-none"
          />
          <Textarea
            id="description"
            autoResizable
            value={description}
            placeholder={"Write something here too..."}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            className="text-lg focus-visible:ring-0 focus-visible:ring-offset-0 border-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PostLayout;
