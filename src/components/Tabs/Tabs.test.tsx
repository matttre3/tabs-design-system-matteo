import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Tab from "./Tab";
import TabList from "./TabList";
import TabPanel from "./TabPanel";
import Tabs from "./Tabs";

function Example({
  defaultValue = "overview",
  onValueChange,
}: {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <Tabs defaultValue={defaultValue} onValueChange={onValueChange}>
      <TabList aria-label="Sections">
        <Tab value="overview" label="Overview" />
        <Tab value="activity" label="Activity" />
        <Tab value="settings" label="Settings" />
      </TabList>
      <TabPanel value="overview">Overview content</TabPanel>
      <TabPanel value="activity">Activity content</TabPanel>
      <TabPanel value="settings">Settings content</TabPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("connects each tab to its panel and exposes only the selected panel", () => {
    render(<Example />);

    const tabList = screen.getByRole("tablist", { name: "Sections" });
    const overview = within(tabList).getByRole("tab", { name: "Overview" });
    const activity = within(tabList).getByRole("tab", { name: "Activity" });
    const overviewPanel = document.getElementById(overview.getAttribute("aria-controls") ?? "");
    const activityPanel = document.getElementById(activity.getAttribute("aria-controls") ?? "");

    expect(overview).toHaveAttribute("aria-selected", "true");
    expect(overview).toHaveAttribute("tabindex", "0");
    expect(activity).toHaveAttribute("aria-selected", "false");
    expect(activity).toHaveAttribute("tabindex", "-1");
    expect(overviewPanel).toHaveAttribute("role", "tabpanel");
    expect(overviewPanel).toHaveAttribute("aria-labelledby", overview.id);
    expect(overviewPanel).toHaveAttribute("tabindex", "0");
    expect(overviewPanel).not.toHaveAttribute("hidden");
    expect(activityPanel).toHaveAttribute("aria-labelledby", activity.id);
    expect(activityPanel).toHaveAttribute("hidden");
  });

  it("changes uncontrolled selection by click and notifies only when the value changes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);

    const overview = screen.getByRole("tab", { name: "Overview" });
    const activity = screen.getByRole("tab", { name: "Activity" });

    await user.click(overview);
    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(activity);
    expect(activity).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Activity" })).toHaveTextContent(
      "Activity content",
    );
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("activity");

    await user.click(activity);
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("automatically activates tabs with arrow keys, Home and End, including wraparound", async () => {
    const user = userEvent.setup();
    render(<Example />);

    const overview = screen.getByRole("tab", { name: "Overview" });
    const activity = screen.getByRole("tab", { name: "Activity" });
    const settings = screen.getByRole("tab", { name: "Settings" });

    overview.focus();
    await user.keyboard("{ArrowRight}");
    expect(activity).toHaveFocus();
    expect(activity).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{End}");
    expect(settings).toHaveFocus();
    expect(settings).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowRight}");
    expect(overview).toHaveFocus();
    expect(overview).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowLeft}");
    expect(settings).toHaveFocus();

    await user.keyboard("{Home}");
    expect(overview).toHaveFocus();
  });

  it("lets Tab move from the selected tab to its text-only panel", async () => {
    const user = userEvent.setup();
    render(<Example />);

    screen.getByRole("tab", { name: "Overview" }).focus();
    await user.tab();

    expect(screen.getByRole("tabpanel", { name: "Overview" })).toHaveFocus();
  });

  it("keeps the parent as the source of truth in controlled mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const controlled = (value: string) => (
      <Tabs value={value} onValueChange={onValueChange}>
        <TabList aria-label="Controlled sections">
          <Tab value="first" label="First" />
          <Tab value="second" label="Second" />
        </TabList>
        <TabPanel value="first">First content</TabPanel>
        <TabPanel value="second">Second content</TabPanel>
      </Tabs>
    );
    const { rerender } = render(controlled("first"));

    await user.click(screen.getByRole("tab", { name: "Second" }));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("second");
    expect(screen.getByRole("tab", { name: "First" })).toHaveAttribute("aria-selected", "true");

    rerender(controlled("second"));
    expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Second" })).toHaveTextContent("Second content");
  });

  it("keeps independent groups and their generated IDs separate", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Example />
        <Example />
      </>,
    );

    const [firstList, secondList] = screen.getAllByRole("tablist", { name: "Sections" });
    const firstActivity = within(firstList).getByRole("tab", { name: "Activity" });
    const secondActivity = within(secondList).getByRole("tab", { name: "Activity" });

    expect(firstActivity.id).not.toBe(secondActivity.id);
    expect(firstActivity.getAttribute("aria-controls")).not.toBe(
      secondActivity.getAttribute("aria-controls"),
    );

    await user.click(firstActivity);
    expect(firstActivity).toHaveAttribute("aria-selected", "true");
    expect(secondActivity).toHaveAttribute("aria-selected", "false");
  });
});
