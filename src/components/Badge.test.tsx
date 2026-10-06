import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Badge from "./Badge";

describe("Badge", () => {
  it("uses the optional accessible meaning instead of announcing a count twice", () => {
    render(
      <button type="button">
        <Badge label="3" variant="negative" accessibleLabel="3 orders awaiting review" />
      </button>,
    );

    expect(screen.getByRole("button", { name: "3 orders awaiting review" })).toBeInTheDocument();
    expect(screen.getByText("3")).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps the visible text accessible when no extra meaning is supplied", () => {
    render(
      <button type="button">
        <Badge label="Under review" />
      </button>,
    );

    expect(screen.getByRole("button", { name: "Under review" })).toBeInTheDocument();
  });
});
