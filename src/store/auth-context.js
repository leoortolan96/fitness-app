import { createContext, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const AuthContext = createContext({
  isAuthenticated: {},
  isLoading: {},
  user: {},
  userRef: {},
  loginWithRedirect: () => {},
  logout: () => {},
});

export function AuthContextProvider(props) {
  const { loginWithRedirect, logout, isLoading, isAuthenticated, user } =
    useAuth0();

  //Para usar nos hooks
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      if (!userRef.current) loginWithRedirect();
    }, 1500);
    // eslint-disable-next-line
  }, [userRef.current]);

  const context = {
    isAuthenticated: isAuthenticated,
    isLoading: isLoading,
    user: user,
    userRef: userRef,
    loginWithRedirect: loginWithRedirect,
    logout: logout,
  };

  //   //BYPASS
  //   const context = {
  //     isAuthenticated: true,
  //     isLoading: false,
  //     user: {
  //       sub: "auth0|646d66f7e8cc734161662410",
  //       nickname: "teste",
  //       name: "teste@teste.com",
  //       picture:
  //         "https://s.gravatar.com/avatar/522fa074bad5c579f5258ef849d78436?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fle.png",
  //       updated_at: "2023-05-23T16:21:08.014Z",
  //     },
  //     loginWithRedirect: () => {},
  //     logout: () => {},
  //   };

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
