import React from "react";
import { IBasicChild } from "../types/type";

const AuthContext = React.createContext({
  user: null,
  signIn: (...arg: any) => {},
  signOut: (...arg: any) => {},
});

/**
 * Determine if the user is authenticated render requested page otherwise login page
 * @param IPrivateRoute
 * @returns JSX.Element
 */
const AuthProvider = ({ children }: IBasicChild) => {
  const [user, setUser] = React.useState(null);

  const signIn = (newUser: any, callback: (...arg: any) => {}) => {
    setUser(newUser);
    callback();
  };

  const signOut = (callback: (...arg: any) => {}) => {
    setUser(null);
    callback();
  };

  const value = { user, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthProvider;

export function useAuth() {
  return React.useContext(AuthContext);
}
