import type { ComponentPropsWithRef } from "react";
import Badge from "../Badge";
import { getTabId, getTabPanelId } from "./ids";
import { useTabsContext } from "./TabsContext";
import "../../styles/components/Tab.scss";

export type TabProps = Omit<
  ComponentPropsWithRef<"button">,
  | "children"
  | "value"
  | "type"
  | "id"
  | "role"
  | "tabIndex"
  | "aria-controls"
  | "aria-selected"
  | "aria-disabled"
  | "aria-hidden"
  | "onClick"
  | "onKeyDown"
  | "disabled"
  | "dangerouslySetInnerHTML"
  | "contentEditable"
> & {
  value: string;
  label: string;
  badge?: {
    label: string;
    variant?: "neutral" | "positive" | "negative";
  };
};

export default function Tab({ value, label, badge, className, ref, ...htmlProps }: TabProps) {
  const context = useTabsContext();
  const isSelected = context.selectedTab === value;
  return (
    <button
      {...htmlProps}
      ref={ref}
      className={`tab tab--${context.variant}${className ? ` ${className}` : ""}`}
      type="button"
      id={getTabId(context.baseId, value)}
      aria-controls={getTabPanelId(context.baseId, value)}
      aria-selected={isSelected}
      onClick={() => context.selectTab(value)}
      tabIndex={isSelected ? 0 : -1}
      role="tab"
    >
      <span>{label}</span>
      {badge && <Badge label={badge.label} variant={badge.variant} />}
    </button>
  );
}
