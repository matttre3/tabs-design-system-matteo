import type { ComponentPropsWithRef, KeyboardEvent, ReactNode } from "react";
import { useTabsContext } from "./TabsContext";
import "../../styles/components/TabList.scss";

type TabListElementProps = Omit<
  ComponentPropsWithRef<"div">,
  | "children"
  | "role"
  | "tabIndex"
  | "aria-label"
  | "aria-labelledby"
  | "onKeyDown"
  | "dangerouslySetInnerHTML"
  | "contentEditable"
>;

export type TabListProps = TabListElementProps & {
  children: ReactNode;
} & (
    | { "aria-label": string; "aria-labelledby"?: never }
    | { "aria-label"?: never; "aria-labelledby": string }
  );

export default function TabList({
  children,
  className,
  ref,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...htmlProps
}: TabListProps) {
  const context = useTabsContext();

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const tabList = event.currentTarget;

    const tabs = Array.from(
      tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
    );

    if (tabs.length === 0) return;

    const activeElement = document.activeElement;
    const currentIndex =
      activeElement instanceof HTMLButtonElement ? tabs.indexOf(activeElement) : -1;

    if (currentIndex === -1) return;

    let nextIndex: number;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % tabs.length;
        break;

      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;

      case "Home":
        nextIndex = 0;
        break;

      case "End":
        nextIndex = tabs.length - 1;
        break;

      default:
        return;
    }

    event.preventDefault();

    const nextTab = tabs[nextIndex];

    nextTab.focus();
    nextTab.click();
  }

  return (
    <div
      {...htmlProps}
      ref={ref}
      className={`tab-list tab-list--${context.variant}${className ? ` ${className}` : ""}`}
      role="tablist"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
