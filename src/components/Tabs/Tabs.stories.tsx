import { Canvas, Controls, Description, Title } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import Tab from "./Tab";
import TabList from "./TabList";
import TabPanel from "./TabPanel";
import Tabs from "./Tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <Canvas of={Playground} sourceState="shown" />
          <Controls of={Playground} />
        </>
      ),
      description: {
        component:
          "Tabs is a compound component: Tabs owns selection, TabList groups the buttons, each Tab selects a matching TabPanel. The separate stories document the current API and behavior; disabled tabs, manual activation and automatic validation of Tab/TabPanel pairs are not implemented yet.",
      },
    },
  },
  args: {
    variant: "pill",
    defaultValue: "overview",
    children: null,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["pill", "underline"],
      description: "Visual style shared by the TabList and its Tabs.",
    },
    defaultValue: {
      control: false,
      description: "Initial selection in uncontrolled mode.",
    },
    value: {
      control: false,
      description: "Current selection in controlled mode.",
    },
    onValueChange: {
      control: false,
      description: "Notifies the consumer when a different Tab is selected.",
    },
    children: {
      control: false,
      description: "TabList and matching TabPanel components.",
    },
  },
  render: ({ variant, defaultValue }) => (
    <Tabs variant={variant} defaultValue={defaultValue ?? "overview"}>
      <TabList aria-label="Account sections">
        <Tab
          value="overview"
          label="Overview"
          badge={{ label: "3", variant: "neutral", accessibleLabel: "3 unread updates" }}
        />
        <Tab value="activity" label="Activity" />
        <Tab value="settings" label="Settings" />
      </TabList>
      <TabPanel value="overview">
        <p>Account overview.</p>
      </TabPanel>
      <TabPanel value="activity">
        <p>Recent account activity.</p>
      </TabPanel>
      <TabPanel value="settings">
        <p>Account settings.</p>
      </TabPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: { type: "dynamic", language: "tsx" },
      description: {
        story:
          "Use the variant control to switch between Pill and Underline. Click the Tabs, then try Tab, ArrowLeft/ArrowRight, Home and End.",
      },
    },
  },
};

export const Underline: Story = {
  args: { variant: "underline" },
  parameters: {
    docs: {
      description: {
        story: "The same compound API and state behavior rendered with the Underline variant.",
      },
    },
  },
};

export const InitiallySecondTab: Story = {
  args: { defaultValue: "activity" },
  parameters: {
    docs: {
      description: {
        story:
          "defaultValue selects the initial Tab. It is not a prop for changing selection after mount.",
      },
    },
  },
};

export const WithoutBadge: Story = {
  render: () => (
    <Tabs defaultValue="first">
      <TabList aria-label="Sections without badges">
        <Tab value="first" label="First" />
        <Tab value="second" label="Second" />
        <Tab value="third" label="Third" />
      </TabList>
      <TabPanel value="first">First section content.</TabPanel>
      <TabPanel value="second">Second section content.</TabPanel>
      <TabPanel value="third">Third section content.</TabPanel>
    </Tabs>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "The badge prop is optional on every Tab.",
      },
    },
  },
};

export const VisibleTabListLabel: Story = {
  render: () => (
    <section>
      <h2 id="project-sections-heading">Project sections</h2>
      <Tabs defaultValue="summary">
        <TabList aria-labelledby="project-sections-heading">
          <Tab value="summary" label="Summary" />
          <Tab value="files" label="Files" />
        </TabList>
        <TabPanel value="summary">Project summary.</TabPanel>
        <TabPanel value="files">Project files.</TabPanel>
      </Tabs>
    </section>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "aria-labelledby gives the TabList the name of an existing visible heading, as an alternative to aria-label.",
      },
    },
  },
};

export const BadgeVariantsInTabs: Story = {
  render: () => (
    <Tabs defaultValue="neutral">
      <TabList aria-label="Notification status">
        <Tab value="neutral" label="All" badge={{ label: "12", variant: "neutral" }} />
        <Tab value="positive" label="Completed" badge={{ label: "4", variant: "positive" }} />
        <Tab value="negative" label="Needs review" badge={{ label: "2", variant: "negative" }} />
      </TabList>
      <TabPanel value="neutral">All notifications.</TabPanel>
      <TabPanel value="positive">Completed notifications.</TabPanel>
      <TabPanel value="negative">Notifications needing review.</TabPanel>
    </Tabs>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "All three Badge variants through the Tab API. When a count needs context, provide badge.accessibleLabel so the Tab's accessible name explains it.",
      },
    },
  },
};

function ControlledExample() {
  const [selected, setSelected] = useState("profile");

  return (
    <div>
      <p>Parent-controlled value: {selected}</p>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button type="button" onClick={() => setSelected("profile")}>
          Profile
        </button>
        <button type="button" onClick={() => setSelected("security")}>
          Security
        </button>
      </div>
      <Tabs value={selected} onValueChange={setSelected} variant="pill">
        <TabList aria-label="Controlled settings">
          <Tab value="profile" label="Profile" />
          <Tab value="security" label="Security" />
        </TabList>
        <TabPanel value="profile">Profile preferences.</TabPanel>
        <TabPanel value="security">Security options.</TabPanel>
      </Tabs>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The parent owns value. Both the external buttons and onValueChange update the same React state.",
      },
    },
  },
};

function UncontrolledWithNotificationExample() {
  const [lastChange, setLastChange] = useState("none");

  return (
    <div>
      <Tabs defaultValue="inbox" onValueChange={setLastChange}>
        <TabList aria-label="Mailbox sections">
          <Tab value="inbox" label="Inbox" />
          <Tab value="archive" label="Archive" />
        </TabList>
        <TabPanel value="inbox">Incoming messages.</TabPanel>
        <TabPanel value="archive">Archived messages.</TabPanel>
      </Tabs>
      <p>Last reported value: {lastChange}</p>
    </div>
  );
}

export const UncontrolledWithNotification: Story = {
  render: () => <UncontrolledWithNotificationExample />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Tabs owns its selection, while onValueChange reports selection changes to the parent.",
      },
    },
  },
};

export const MultipleIndependentGroups: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <section>
        <h3>Pill group</h3>
        <Tabs defaultValue="first">
          <TabList aria-label="First group">
            <Tab value="first" label="First" />
            <Tab value="second" label="Second" />
          </TabList>
          <TabPanel value="first">First Pill panel.</TabPanel>
          <TabPanel value="second">Second Pill panel.</TabPanel>
        </Tabs>
      </section>
      <section>
        <h3>Underline group</h3>
        <Tabs defaultValue="first" variant="underline">
          <TabList aria-label="Second group">
            <Tab value="first" label="First" />
            <Tab value="second" label="Second" />
          </TabList>
          <TabPanel value="first">First Underline panel.</TabPanel>
          <TabPanel value="second">Second Underline panel.</TabPanel>
        </Tabs>
      </section>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Two instances reuse the same values but have independent state and distinct IDs from useId.",
      },
    },
  },
};

const manyTabs = [
  { value: "overview", label: "Overview" },
  { value: "activity", label: "Activity" },
  { value: "messages", label: "Messages" },
  { value: "documents", label: "Documents" },
  { value: "payments", label: "Payments" },
  { value: "notifications", label: "Notifications" },
  { value: "settings", label: "Settings" },
];

export const HorizontalOverflow: Story = {
  render: () => (
    <div style={{ width: 320, maxWidth: "100%" }}>
      <Tabs defaultValue="overview">
        <TabList aria-label="Many sections">
          {manyTabs.map(({ value, label }) => (
            <Tab key={value} value={value} label={label} />
          ))}
        </TabList>
        {manyTabs.map(({ value, label }) => (
          <TabPanel key={value} value={value}>
            {label} content.
          </TabPanel>
        ))}
      </Tabs>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The fixed-width wrapper only creates a narrow container. The TabList, not the whole page, scrolls horizontally; Tabs keep their content width.",
      },
    },
  },
};

export const LongLabelsAndBadge: Story = {
  render: () => (
    <div style={{ width: 400, maxWidth: "100%" }}>
      <Tabs defaultValue="one" variant="underline">
        <TabList aria-label="Sections with long labels">
          <Tab
            value="one"
            label="Requests awaiting review"
            badge={{ label: "12", variant: "negative" }}
          />
          <Tab value="two" label="Recently completed activity" />
          <Tab value="three" label="Settings and preferences" />
        </TabList>
        <TabPanel value="one">Requests to review.</TabPanel>
        <TabPanel value="two">Completed activity.</TabPanel>
        <TabPanel value="three">Preferences.</TabPanel>
      </Tabs>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Exercises long labels, an Underline indicator that follows the full Tab width, a Badge and horizontal overflow.",
      },
    },
  },
};

export const MobilePill: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  parameters: {
    docs: {
      description: {
        story:
          "Renders at 320px so the actual media query is exercised. The Tab keeps Body M typography on mobile, as specified in Figma.",
      },
    },
  },
};

export const MobileUnderline: Story = {
  args: { variant: "underline" },
  globals: { viewport: { value: "mobile1", isRotated: false } },
  parameters: {
    docs: {
      description: {
        story: "The Underline variant at the mobile breakpoint, including its smaller TabList gap.",
      },
    },
  },
};

export const InteractivePanelContent: Story = {
  render: () => (
    <Tabs defaultValue="details" variant="underline">
      <TabList aria-label="Product details">
        <Tab value="details" label="Details" />
        <Tab value="reviews" label="Reviews" />
      </TabList>
      <TabPanel value="details">
        <button type="button">Panel action</button>
      </TabPanel>
      <TabPanel value="reviews">
        <button type="button">Read reviews</button>
      </TabPanel>
    </Tabs>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The active panel contains a focusable control. TabPanel itself is also focusable, so text-only panels remain in the Tab sequence.",
      },
    },
  },
};

function FormExample() {
  const [submits, setSubmits] = useState(0);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmits((count) => count + 1);
      }}
    >
      <Tabs defaultValue="personal">
        <TabList aria-label="Form sections">
          <Tab value="personal" label="Personal details" />
          <Tab value="preferences" label="Preferences" />
        </TabList>
        <TabPanel value="personal">Personal details section.</TabPanel>
        <TabPanel value="preferences">Preferences section.</TabPanel>
      </Tabs>
      <button type="submit" style={{ marginTop: "1rem" }}>
        Submit form
      </button>
      <p>Submissions: {submits}</p>
    </form>
  );
}

export const InsideForm: Story = {
  render: () => <FormExample />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Tab buttons have type=button, so changing Tabs does not submit the form. Only the explicit submit button increments the counter.",
      },
    },
  },
};

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overview = canvas.getByRole("tab", { name: /Overview/ });
    const activity = canvas.getByRole("tab", { name: "Activity" });
    const settings = canvas.getByRole("tab", { name: "Settings" });

    overview.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(activity).toHaveFocus();
    await expect(activity).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tabpanel", { name: "Activity" })).not.toHaveAttribute("hidden");

    await userEvent.keyboard("{End}");
    await expect(settings).toHaveFocus();
    await expect(settings).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{ArrowRight}");
    await expect(overview).toHaveFocus();
    await expect(overview).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Home}");
    await expect(overview).toHaveFocus();
    await expect(overview).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Tab}");
    await expect(canvas.getByRole("tabpanel", { name: /Overview/ })).toHaveFocus();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Its play function demonstrates ArrowRight, End, wrap-around and Tab into the active panel. Assertions check focus, selection and the associated panel instead of private functions.",
      },
    },
  },
};
