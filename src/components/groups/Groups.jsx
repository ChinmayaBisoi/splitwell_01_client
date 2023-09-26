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
import { CreateGroup } from "./CreateGroup";

const Groups = () => {
  const postState = usePostState();
  const postStateDispatch = usePostStateDispatch();

  const { toast } = useToast();

  const loginState = useLoginState();
  const isLoggedIn = loginState.isLoggedIn;

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold">Groups</h1>
          <h3 className="text-gray-500">Create and manage groups.</h3>
        </div>
        <CreateGroup />
      </div>
      <div>
        <div className="">
          {!isLoggedIn && (
            <h2 className="text-xl font-semibold mb-4">
              Login to view your groups
            </h2>
          )}
          {/* <div className="flex flex-col gap-4">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Groups;
