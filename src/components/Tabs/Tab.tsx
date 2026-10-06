import { type ComponentPropsWithRef, useCallback, useRef } from "react";
import Badge, { type BadgeProps } from "../Badge";
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
  badge?: BadgeProps;
};

export default function Tab({
  value,
  label,
  badge,
  className,
  ref,
  "aria-label": ariaLabel,
  ...htmlProps
}: TabProps) {
  const context = useTabsContext();
  const isSelected = context.selectedTab === value;
  const elementRef = useRef<HTMLButtonElement | null>(null);
  const accessibleName =
    ariaLabel ?? (badge ? `${label} ${badge.accessibleLabel ?? badge.label}` : undefined);

  const setRef = useCallback(
    (element: HTMLButtonElement | null) => {
      if (elementRef.current) context.unregisterTab(elementRef.current);
      elementRef.current = element;
      if (element) context.registerTab(value, element);

      if (typeof ref === "function") ref(element);
      else if (ref) ref.current = element;
    },
    [context.registerTab, context.unregisterTab, ref, value],
  );

  return (
    <button
      {...htmlProps}
      ref={setRef}
      className={`tab tab--${context.variant}${className ? ` ${className}` : ""}`}
      type="button"
      id={getTabId(context.baseId, value)}
      aria-label={accessibleName}
      aria-controls={getTabPanelId(context.baseId, value)}
      aria-selected={isSelected}
      onClick={() => context.selectTab(value)}
      tabIndex={context.tabbableTab === value ? 0 : -1}
      role="tab"
    >
      <span>{label}</span>
      {badge && <Badge {...badge} />}
    </button>
  );
}
