"use client";
import { createContext, useContext } from "react";

const AppContext = createContext();

export function AppWrapper({ user, children }) {
  // console.log(`global user object: `, user);

  return <AppContext.Provider value={{ user }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
