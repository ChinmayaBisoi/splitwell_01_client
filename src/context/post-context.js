import * as React from "react";

const PostStateContext = React.createContext(undefined);
const PostStateDispatchContext = React.createContext(undefined);

const initialState = {
  tempPosts: [
    {
      id: "60a7af35-847b-41bd-89a1-480fc5fe5c0c",
      title: "Title 123",
      description: "Test description 123455",
    },
  ],
  savedPosts: null,
};

function postStateReducer(state, action) {
  console.log("here at start", state, action);

  const tempPosts = state.tempPosts;
  const savedPosts = state.savedPosts;
  switch (action.type) {
    case "save-temp-post": {
      const newPost = action.post;
      return { ...state, tempPosts: [newPost, ...tempPosts] };
    }

    case "update-temp-post": {
      const updatedPost = action.post;
      const filteredPosts = tempPosts.map((post) => {
        if (post.id === updatedPost.id) return { ...updatedPost };
        return post;
      });
      return { ...state, tempPosts: [...filteredPosts] };
    }

    case "delete-temp-post": {
      const filteredPosts = tempPosts.filter((k) => k.id !== action.postId);
      return { ...state, tempPosts: filteredPosts };
    }

    case "set-posts": {
      const posts = action.posts;
      console.log("posts set from backend");
      return { ...state, savedPosts: posts };
    }

    case "save-post": {
      const newPost = action.post;
      return { ...state, savedPosts: [newPost, ...savedPosts] };
    }

    case "update-post": {
      const updatedPost = action.post;
      const filteredPosts = savedPosts.map((post) => {
        if (post._id === updatedPost._id) return { ...updatedPost };
        return post;
      });
      return { ...state, savedPosts: [...filteredPosts] };
    }

    case "delete-post": {
      const filteredPosts = savedPosts.filter((k) => k._id !== action.postId);
      return { ...state, savedPosts: filteredPosts };
    }

    default: {
      console.log("here at least");
      return state;
    }
  }
}

function PostStateProvider({ children }) {
  const [state, dispatch] = React.useReducer(postStateReducer, {
    ...initialState,
  });

  return (
    <PostStateContext.Provider value={state}>
      <PostStateDispatchContext.Provider value={dispatch}>
        {children}
      </PostStateDispatchContext.Provider>
    </PostStateContext.Provider>
  );
}

function usePostState() {
  const context = React.useContext(PostStateContext);
  if (context === undefined) {
    throw new Error("usePostState must be used within a CountProvider");
  }
  return context;
}

function usePostStateDispatch() {
  const context = React.useContext(PostStateDispatchContext);
  if (context === undefined) {
    throw new Error("usePostStateDispatch must be used within a CountProvider");
  }
  return context;
}

export { PostStateProvider, usePostState, usePostStateDispatch };
