import * as React from "react";

const LoginStateContext = React.createContext(undefined);
const LoginStateDispatchContext = React.createContext(undefined);

const initialState = {
  isLoggedIn: false,
  loading: true,
  error: false,
  user: null,
};

function loginStateReducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.user || {},
        loading: false,
        isLoggedIn: true,
      };
    case "logout":
      return { ...initialState, loading: false };
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
