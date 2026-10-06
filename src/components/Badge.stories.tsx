import { Canvas, Controls, Description, Title } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Badge from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
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
          "Badge is informational text, not an interactive control. It can be used on its own or through Tab's badge prop. Use accessibleLabel when a short visible label needs more context, and do not rely on color alone to convey meaning.",
      },
    },
  },
  args: {
    label: "12",
    variant: "neutral",
  },
  argTypes: {
    label: { control: "text" },
    accessibleLabel: {
      control: "text",
      description: "Optional meaning announced instead of the visible badge text.",
    },
    variant: {
      control: "inline-radio",
      options: ["neutral", "positive", "negative"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: { docs: { source: { type: "dynamic", language: "tsx" } } },
};

export const Neutral: Story = {
  args: { label: "12", variant: "neutral" },
};

export const Positive: Story = {
  args: { label: "4", variant: "positive" },
};

export const Negative: Story = {
  args: { label: "2", variant: "negative" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <Badge label="12" variant="neutral" />
      <Badge label="4" variant="positive" />
      <Badge label="2" variant="negative" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "The three currently supported semantic variants side by side.",
      },
    },
  },
};

export const LongerLabel: Story = {
  args: { label: "Under review", variant: "negative" },
  parameters: {
    docs: {
      description: {
        story: "A longer text value to check spacing, typography and contrast.",
      },
    },
  },
};

export const AccessibleCount: Story = {
  args: { label: "3", variant: "negative", accessibleLabel: "3 orders awaiting review" },
  parameters: {
    docs: {
      description: {
        story:
          "The visible badge stays short, while assistive technology receives the count with its meaning.",
      },
    },
  },
};
