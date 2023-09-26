import * as React from "react";

const LoginStateContext = React.createContext(undefined);
const LoginStateDispatchContext = React.createContext(undefined);

const initialState = {
  isLoggedIn: false,
  email: null,
  userId: null,
};

function loginStateReducer(state, action) {
  switch (action.type) {
    case "update-user-info":
      const userInfo = { ...(action?.userData || {}) };
      return { ...state, isLoggedIn: true, ...userInfo };
    case "login":
      return {
        ...state,
        isLoggedIn: true,
        email: action.email,
        userId: action.userId,
      };
    case "logout":
      return { ...state, isLoggedIn: false, email: null, userId: null };
    default:
      return state;
  }
}

function LoginStateProvider({ children }) {
  const [state, dispatch] = React.useReducer(loginStateReducer, {
    ...initialState,
  });

  return (
    <LoginStateContext.Provider value={state}>
      <LoginStateDispatchContext.Provider value={dispatch}>
        {children}
      </LoginStateDispatchContext.Provider>
    </LoginStateContext.Provider>
  );
}

function useLoginState() {
  const context = React.useContext(LoginStateContext);
  if (context === undefined) {
    throw new Error("useLoginState must be used within a CountProvider");
  }
  return context;
}

function useLoginStateDispatch() {
  const context = React.useContext(LoginStateDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useLoginStateDispatch must be used within a CountProvider"
    );
  }
  return context;
}

export { LoginStateProvider, useLoginState, useLoginStateDispatch };
