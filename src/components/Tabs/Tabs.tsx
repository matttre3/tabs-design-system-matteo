import { type ReactNode, useId, useState } from "react";
import { TabsContext } from "./TabsContext";

type BaseTabsProps = {
  variant?: "pill" | "underline";
  children: ReactNode;
};

type ControlledTabsProps = {
  value: string;
  defaultValue?: never;
  onValueChange: (value: string) => void;
};

type UncontrolledTabsProps = {
  value?: never;
  defaultValue: string;
  onValueChange?: (value: string) => void;
};

type TabsProps = BaseTabsProps & (ControlledTabsProps | UncontrolledTabsProps);

export default function Tabs({
  defaultValue,
  onValueChange,
  value,
  children,
  variant = "pill",
}: TabsProps) {
  const baseId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const selectedTab = value ?? internalValue;
  function selectTab(newValue: string) {
    if (newValue === selectedTab) return;

    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  }

  return (
    <TabsContext.Provider value={{ baseId, selectedTab, selectTab, variant }}>
      {children}
    </TabsContext.Provider>
  );
}
