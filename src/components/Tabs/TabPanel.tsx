// biome-ignore-all lint/a11y/noNoninteractiveTabindex: WAI-ARIA Tabs recommends a focusable panel for text-only content.
import type { ComponentPropsWithRef, ReactNode } from "react";
import { getTabId, getTabPanelId } from "./ids";
import { useTabsContext } from "./TabsContext";

export type TabPanelProps = Omit<
  ComponentPropsWithRef<"div">,
  | "children"
  | "id"
  | "role"
  | "tabIndex"
  | "aria-labelledby"
  | "aria-hidden"
  | "hidden"
  | "dangerouslySetInnerHTML"
  | "contentEditable"
> & {
  value: string;
  children: ReactNode;
};
export default function TabPanel({ value, children, ref, ...htmlProps }: TabPanelProps) {
  const context = useTabsContext();
  const isSelected = context.selectedTab === value;
  return (
    <div
      {...htmlProps}
      ref={ref}
      role="tabpanel"
      tabIndex={0}
      aria-labelledby={getTabId(context.baseId, value)}
      hidden={!isSelected}
      id={getTabPanelId(context.baseId, value)}
    >
      {children}
    </div>
  );
}
