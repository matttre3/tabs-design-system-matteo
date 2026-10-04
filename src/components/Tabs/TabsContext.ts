import { createContext, useContext } from "react";

type TabContextType = {
  baseId: string;
  selectedTab: string;
  selectTab: (value: string) => void;
  variant: "pill" | "underline";
};

export const TabsContext = createContext<TabContextType | undefined>(undefined);

export const useTabsContext = () => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("useTabsContext must be used inside Tabs");
  }

  return context;
};
