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
  it("renders badge variants and gives a count its optional accessible meaning", () => {
    render(
      <Tabs defaultValue="all">
        <TabList aria-label="Orders">
          <Tab value="all" label="All" badge={{ label: "12" }} />
          <Tab value="completed" label="Completed" badge={{ label: "4", variant: "positive" }} />
          <Tab
            value="review"
            label="Orders"
            badge={{ label: "3", variant: "negative", accessibleLabel: "3 awaiting review" }}
          />
        </TabList>
        <TabPanel value="all">All orders</TabPanel>
        <TabPanel value="completed">Completed orders</TabPanel>
        <TabPanel value="review">Orders awaiting review</TabPanel>
      </Tabs>,
    );

    const all = screen.getByRole("tab", { name: "All 12" });
    const completed = screen.getByRole("tab", { name: "Completed 4" });
    const review = screen.getByRole("tab", { name: "Orders 3 awaiting review" });

    expect(within(all).getByText("12")).toHaveClass("badge--neutral");
    expect(within(completed).getByText("4")).toHaveClass("badge--positive");
    expect(within(review).getByText("3")).toHaveAttribute("aria-hidden", "true");
    expect(within(review).getByText("3").parentElement).toHaveClass("badge--negative");
  });

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

  it("selects the first registered tab when defaultValue does not exist", () => {
    render(<Example defaultValue="missing" />);

    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tabpanel", { name: "Overview" })).toBeVisible();
  });

  it("selects the next remaining tab and restores focus when the selected tab is removed", () => {
    const dynamic = (showActivity: boolean) => (
      <Tabs defaultValue="activity">
        <TabList aria-label="Dynamic sections">
          <Tab value="overview" label="Overview" />
          {showActivity && <Tab value="activity" label="Activity" />}
          <Tab value="settings" label="Settings" />
        </TabList>
        <TabPanel value="overview">Overview content</TabPanel>
        {showActivity && <TabPanel value="activity">Activity content</TabPanel>}
        <TabPanel value="settings">Settings content</TabPanel>
      </Tabs>
    );
    const { rerender } = render(dynamic(true));

    screen.getByRole("tab", { name: "Activity" }).focus();
    rerender(dynamic(false));

    const settings = screen.getByRole("tab", { name: "Settings" });
    expect(settings).toHaveAttribute("aria-selected", "true");
    expect(settings).toHaveAttribute("tabindex", "0");
    expect(settings).toHaveFocus();
    expect(screen.getByRole("tabpanel", { name: "Settings" })).toBeVisible();
  });

  it("selects the previous tab when the last selected tab is removed", () => {
    const dynamic = (showSettings: boolean) => (
      <Tabs defaultValue="settings">
        <TabList aria-label="Dynamic sections">
          <Tab value="overview" label="Overview" />
          <Tab value="activity" label="Activity" />
          {showSettings && <Tab value="settings" label="Settings" />}
        </TabList>
        <TabPanel value="overview">Overview content</TabPanel>
        <TabPanel value="activity">Activity content</TabPanel>
        {showSettings && <TabPanel value="settings">Settings content</TabPanel>}
      </Tabs>
    );
    const { rerender } = render(dynamic(true));

    rerender(dynamic(false));

    expect(screen.getByRole("tab", { name: "Activity" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Activity" })).toBeVisible();
  });

  it("keeps an invalid controlled value owned by the parent but leaves a tab reachable", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Tabs value="missing" onValueChange={onValueChange}>
        <TabList aria-label="Controlled sections">
          <Tab value="overview" label="Overview" />
          <Tab value="activity" label="Activity" />
        </TabList>
        <TabPanel value="overview">Overview content</TabPanel>
        <TabPanel value="activity">Activity content</TabPanel>
      </Tabs>,
    );

    const overview = screen.getByRole("tab", { name: "Overview" });
    expect(overview).toHaveAttribute("tabindex", "0");
    expect(overview).toHaveAttribute("aria-selected", "false");
    expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('controlled value "missing"'));

    await user.tab();
    expect(overview).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("activity");
    warning.mockRestore();
  });

  it("does not change a controlled value when its tab is removed", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    const onValueChange = vi.fn();
    const dynamic = (showActivity: boolean) => (
      <Tabs value="activity" onValueChange={onValueChange}>
        <TabList aria-label="Controlled sections">
          <Tab value="overview" label="Overview" />
          {showActivity && <Tab value="activity" label="Activity" />}
        </TabList>
        <TabPanel value="overview">Overview content</TabPanel>
        {showActivity && <TabPanel value="activity">Activity content</TabPanel>}
      </Tabs>
    );
    const { rerender } = render(dynamic(true));

    screen.getByRole("tab", { name: "Activity" }).focus();
    rerender(dynamic(false));

    const overview = screen.getByRole("tab", { name: "Overview" });
    expect(overview).toHaveAttribute("aria-selected", "false");
    expect(overview).toHaveAttribute("tabindex", "0");
    expect(overview).toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('controlled value "activity"'));
    warning.mockRestore();
  });
});
