import { type ReactNode, useCallback, useId, useLayoutEffect, useRef, useState } from "react";
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
  const [registeredTabs, setRegisteredTabs] = useState(() => new Map<HTMLButtonElement, string>());
  const previousOrder = useRef<string[]>([]);
  const restoreFocus = useRef(false);
  const warnedInvalidValue = useRef<string | undefined>(undefined);
  const selectedTab = value ?? internalValue;

  const registerTab = useCallback((tabValue: string, element: HTMLButtonElement) => {
    setRegisteredTabs((current) => {
      if (current.get(element) === tabValue) return current;
      const next = new Map(current);
      next.set(element, tabValue);
      return next;
    });
  }, []);

  const unregisterTab = useCallback((element: HTMLButtonElement) => {
    if (element.ownerDocument.activeElement === element) restoreFocus.current = true;
    setRegisteredTabs((current) => {
      if (!current.has(element)) return current;
      const next = new Map(current);
      next.delete(element);
      return next;
    });
  }, []);

  // DOM order, rather than mount order, also handles fragments and reordered children.
  const orderedTabs = Array.from(registeredTabs, ([element, tabValue]) => ({
    element,
    value: tabValue,
  })).sort((a, b) =>
    a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  );
  const selectedExists = orderedTabs.some((tab) => tab.value === selectedTab);
  const tabbableTab = selectedExists ? selectedTab : (orderedTabs[0]?.value ?? selectedTab);

  useLayoutEffect(() => {
    if (orderedTabs.length === 0) {
      previousOrder.current = [];
      restoreFocus.current = false;
      return;
    }

    if (selectedExists) warnedInvalidValue.current = undefined;

    if (!selectedExists && value === undefined) {
      const previousIndex = previousOrder.current.indexOf(selectedTab);
      const fallbackIndex = previousIndex < 0 ? 0 : Math.min(previousIndex, orderedTabs.length - 1);
      setInternalValue(orderedTabs[fallbackIndex].value);
    } else {
      if (!selectedExists && import.meta.env.DEV && warnedInvalidValue.current !== value) {
        console.warn(
          `Tabs: controlled value "${value}" does not match any registered Tab. The parent must provide a valid value.`,
        );
        warnedInvalidValue.current = value;
      }
      if (restoreFocus.current) {
        const target = orderedTabs.find((tab) => tab.value === tabbableTab)?.element;
        if (target?.isConnected) {
          target.focus();
          restoreFocus.current = false;
        }
      }
    }

    previousOrder.current = orderedTabs.map((tab) => tab.value);
  }, [orderedTabs, selectedTab, selectedExists, tabbableTab, value]);

  function selectTab(newValue: string) {
    if (newValue === selectedTab) return;

    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  }

  return (
    <TabsContext.Provider
      value={{ baseId, selectedTab, tabbableTab, selectTab, registerTab, unregisterTab, variant }}
    >
      {children}
    </TabsContext.Provider>
  );
}
