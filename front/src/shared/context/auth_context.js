import { createContext } from "react";

export const auth_context = createContext({
  isLoggedIn: false,
  userId : null,
  LOGIN: () => {},
  LOGOUT: () => {},
});
