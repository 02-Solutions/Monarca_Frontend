/**
 * File: SidebarOption.test.tsx
 * Description: Test suite for the SidebarOption component
 * Last edited: 16/05/2025
 * Author: Gabriel Edid Harari
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SidebarOption from "../../components/SiderbarOption";

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
  it("renders the sidebar option with correct label", () => {
    render(<SidebarOption label="Dashboard" link="/dashboard" />);

    // Verify label is rendered
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  /**
   * Tests if the component renders a link with the correct destination URL
   */
  it("renders a link to the correct destination", () => {
    render(<SidebarOption label="Bookings" link="/bookings" />);

    // Verify link is rendered with correct destination
    const link = screen.getByTestId("link-to-/bookings");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/bookings");
  });

  /**
   * Tests if the SVG icon is correctly rendered
   */
  it("renders the SVG icon", () => {
    render(<SidebarOption label="Profile" link="/profile" />);

    // Check if the SVG is rendered
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();

    // Check SVG paths
    const paths = document.querySelectorAll("path");
    expect(paths.length).toBe(2);
  });

  /**
   * Tests if the component applies the correct CSS classes
   */
  it("applies the correct CSS classes", () => {
    render(<SidebarOption label="Settings" link="/settings" />);

    // Check if the link has the correct classes
    const link = screen.getByTestId("link-to-/settings");
    expect(link).toHaveClass(
      "flex items-center p-2 text-[var(--dark-blue)] rounded-lg hover:bg-[var(--blue)] hover:text-[var(--white)]"
    );

    // Check if the SVG has the correct classes
    const svg = document.querySelector("svg");
    expect(svg).toHaveClass(
      "w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
    );

    // Check if the text span has the correct classes
    const span = screen.getByText("Settings").closest("span");
    expect(span).toHaveClass("ms-3");
  });

  /**
   * Tests if the sidebar option is properly wrapped in a list item
   */
  it("wraps the link in a list item", () => {
    render(<SidebarOption label="Help" link="/help" />);

    // Check if the link is wrapped in a li tag
    const listItem = screen.getByText("Help").closest("li");
    expect(listItem).toBeInTheDocument();
  });
});
