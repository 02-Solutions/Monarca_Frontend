/**
 * File: SidebarOption.test.tsx
 * Description: Test suite for the SidebarOption component
 * Last edited: 16/05/2025
 * Author: Gabriel Edid Harari
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SidebarOption from "../../components/SiderbarOption.tsx";

/**
 * Mock react-router-dom Link component to simplify testing
 */
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: ({ to, children, className }: any) => (
      <a href={to} data-testid={`link-to-${to}`} className={className}>
        {children}
      </a>
    ),
  };
});

describe("SidebarOption", () => {
  /**
   * Tests if the sidebar option renders with the correct label text
   */
  it("renders the image icon", () => {
    render(
      <SidebarOption label="Profile" pathIcon="/icon.png" link="/profile" />,
    );

    // Check if the image is rendered
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("alt", "Profile");
    expect(img).toHaveAttribute("src", "/icon.png");
  });

  /**
   * Tests if the component renders a link with the correct destination URL
   */
  it("renders a link to the correct destination", () => {
    render(
      <SidebarOption
        label="Bookings"
        pathIcon="/Booking.png"
        link="/bookings"
      />,
    );

    // Verify link is rendered with correct destination
    const link = screen.getByTestId("link-to-/bookings");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/bookings");
  });

  /**
   * Tests if the SVG icon is correctly rendered
   */
  it("renders the image icon", () => {
    render(
      <SidebarOption label="Profile" pathIcon="/icon.png" link="/profile" />,
    );

    // Check if the image is rendered
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("alt", "Profile");
    expect(img).toHaveAttribute("src", "/icon.png");
  });

  /**
   * Tests if the component applies the correct CSS classes
   */
  it("applies the correct CSS classes", () => {
    render(
      <SidebarOption
        label="Settings"
        pathIcon="/settings.png"
        link="/settings"
      />,
    );

    // Check if the link has the correct classes
    const link = screen.getByTestId("link-to-/settings");
    expect(link).toHaveClass(
      "group flex items-center p-2 text-[var(--dark-blue)] text-sm rounded-lg hover:bg-[var(--blue)] hover:text-[var(--white)] gap-2",
    );

    // Check if the image has the correct classes
    const img = screen.getByRole("img");
    expect(img).toHaveClass("w-6 h-6 group-hover:invert-0 invert");

    // Check if the text span has the correct classes
    const span = screen.getByText("Settings");
    expect(span).toHaveClass(
      "whitespace-nowrap overflow-hidden [mask-image:linear-gradient(to_right,black_80%,transparent)] w-[130px]",
    );
  });

  /**
   * Tests if the sidebar option is properly wrapped in a list item
   */
  it("wraps the link in a list item", () => {
    render(<SidebarOption label="Help" pathIcon="/Help.png" link="/help" />);

    // Check if the link is wrapped in a li tag
    const listItem = screen.getByText("Help").closest("li");
    expect(listItem).toBeInTheDocument();
  });
});
