import { useLoginState } from "@/context/login-context";
import { usePostState, usePostStateDispatch } from "@/context/post-context";
import getAllTodos from "@/pages/api/posts/get-all-todos";
import Link from "next/link";
import React, { useEffect } from "react";
import InformationCircle from "../icons/InformationCircle";
import VerticalDots from "../icons/VerticalDots";
import { Tooltip } from "../Tooltip";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { useToast } from "../ui/use-toast";
import deleteTodo from "@/pages/api/posts/delete-todo";

const Posts = () => {
  const postState = usePostState();
  const postStateDispatch = usePostStateDispatch();

  const { toast } = useToast();

  const loginState = useLoginState();
  const isLoggedIn = loginState.isLoggedIn;

  console.log(postState);

  const tempPosts = postState.tempPosts;
  const savedPosts = postState.savedPosts;

  async function deletePost(postId) {
    const isSavedPost = postState.savedPosts.find(
      (post) => post._id === postId
    );
    const isTempPost = postState.tempPosts.find((post) => post.id === postId);

    if (isTempPost) {
      postStateDispatch({
        type: "delete-temp-post",
        postId: postId,
      });
      toast({
        title: "Post deleted",
        description: "",
        variant: "destructive",
      });
    }

    if (isSavedPost) {
      await deleteTodo({ todoId: postId }).then((res) => {
        console.log(res);
        if (res.ok) {
          postStateDispatch({
            type: "delete-post",
            postId: postId,
          });
          toast({
            title: "Post deleted",
            description: "",
            variant: "destructive",
          });
        }
      });
    }
  }

  useEffect(() => {
    console.log(postState);
  });

  useEffect(() => {
    if (isLoggedIn) {
      (async function fetchAllTodos() {
        await getAllTodos().then((res) => {
          if (res.ok) {
            postStateDispatch({
              type: "set-posts",
              posts: res.todos,
            });
          }
        });
      })();
    }
  }, [isLoggedIn]);
  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold">Posts</h1>
          <h3 className="text-gray-500">Create and manage posts.</h3>
        </div>
        <Link href="/posts/new">
          <Button className="flex items-center gap-2">
            <span>+</span>
            <span>New post</span>
          </Button>
        </Link>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Temporary posts</h2>
          <Tooltip
            content={
              "Temporary post is implemented for guest users to experience the app"
            }>
            <InformationCircle
              className="cursor-pointer mt-0.5"
              width={16}
              height={16}
            />
          </Tooltip>
        </div>
        <div className="flex flex-col gap-4">
          {tempPosts?.length > 0 ? (
            tempPosts.map(({ title, description, id }) => {
              return (
                <div
                  key={id + title + description}
                  className="p-4 flex md:gap-4 gap-2 border border-gray-300 rounded-lg">
                  <div className="grow">
                    <p className="text-lg font-semibold">{title}</p>
                    <p>{description}</p>
                  </div>
                  <Popover>
                    <PopoverTrigger className="self-start">
                      <div className="p-2 border border-gray-200 hover:bg-gray-100 self-start rounded-md">
                        <VerticalDots height="16" width="16" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[100px] p-0">
                      <div className="flex flex-col">
                        <Link href={`/posts/edit/${id}`}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          onClick={() => {
                            deletePost(id);
                          }}
                          variant="ghost"
                          className="justify-start !text-red-500">
                          Delete
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              );
            })
          ) : (
            <p>No Posts present</p>
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Saved Posts</h2>
          <div className="flex flex-col gap-4">
            {isLoggedIn ? (
              savedPosts?.length > 0 ? (
                savedPosts
                  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                  .map(({ title, description, _id: id, updatedAt }) => {
                    console.log(updatedAt);
                    const postUpdatedAt = format(
                      new Date(updatedAt),
                      "dd MMM yyyy"
                    );
                    return (
                      <div
                        key={id ?? updatedAt}
                        className="p-4 flex md:gap-4 gap-2 border border-gray-300 rounded-lg">
                        <div className="grow">
                          <p className="text-xs font-semibold">
                            {postUpdatedAt}
                          </p>
                          <p className="text-lg font-semibold">{title}</p>
                          <p>{description}</p>
                        </div>
                        <Popover>
                          <PopoverTrigger className="self-start">
                            <div className="p-2 border border-gray-200 hover:bg-gray-100 self-start rounded-md">
                              <VerticalDots height="16" width="16" />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-[100px] p-0">
                            <div className="flex flex-col">
                              <Link href={`/posts/edit/${id}`}>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start">
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                onClick={() => {
                                  deletePost(id);
                                }}
                                variant="ghost"
                                className="justify-start !text-red-500">
                                Delete
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    );
                  })
              ) : (
                <p>No posts available.</p>
              )
            ) : (
              <p>Login to view saved posts.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
