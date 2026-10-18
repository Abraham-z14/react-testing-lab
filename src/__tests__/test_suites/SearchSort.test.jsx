import { render, screen, fireEvent, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AccountContainer from "../../components/AccountContainer";

const mockTransactions = [
  {
    id: "1",
    date: "2026-10-18",
    description: "Uber Ride",
    category: "Transportation",
    amount: -25,
  },
  {
    id: "2",
    date: "2026-10-17",
    description: "Grocery Store",
    category: "Food",
    amount: -50,
  },
  {
    id: "3",
    date: "2026-10-16",
    description: "Paycheck",
    category: "Income",
    amount: 1000,
  },
];

describe("Search and Sort Transactions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTransactions),
      })
    );
  });

  it("filters transactions based on search text", async () => {
    render(<AccountContainer />);

    await screen.findByText("Uber Ride");

    const searchInput = screen.getByPlaceholderText(
      "Search your Recent Transactions"
    );

    fireEvent.change(searchInput, {
      target: { value: "Grocery" },
    });

    expect(screen.getByText("Grocery Store")).toBeInTheDocument();
    expect(screen.queryByText("Uber Ride")).not.toBeInTheDocument();
    expect(screen.queryByText("Paycheck")).not.toBeInTheDocument();
  });

  it("searches without caring about uppercase or lowercase", async () => {
    render(<AccountContainer />);

    await screen.findByText("Uber Ride");

    const searchInput = screen.getByPlaceholderText(
      "Search your Recent Transactions"
    );

    fireEvent.change(searchInput, {
      target: { value: "paycheck" },
    });

    expect(screen.getByText("Paycheck")).toBeInTheDocument();
  });

  it("shows all transactions again when the search is cleared", async () => {
    render(<AccountContainer />);

    await screen.findByText("Uber Ride");

    const searchInput = screen.getByPlaceholderText(
      "Search your Recent Transactions"
    );

    fireEvent.change(searchInput, {
      target: { value: "Grocery" },
    });

    fireEvent.change(searchInput, {
      target: { value: "" },
    });

    expect(screen.getByText("Uber Ride")).toBeInTheDocument();
    expect(screen.getByText("Grocery Store")).toBeInTheDocument();
    expect(screen.getByText("Paycheck")).toBeInTheDocument();
  });

  it("sorts transactions by description", async () => {
    render(<AccountContainer />);

    await screen.findByText("Uber Ride");

    const sortMenu = screen.getByRole("combobox");

    fireEvent.change(sortMenu, {
      target: { value: "description" },
    });

    const rows = screen.getAllByRole("row").slice(1);

    expect(within(rows[0]).getByText("Grocery Store")).toBeInTheDocument();
    expect(within(rows[1]).getByText("Paycheck")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Uber Ride")).toBeInTheDocument();
  });

  it("sorts transactions by category", async () => {
    render(<AccountContainer />);

    await screen.findByText("Uber Ride");

    const sortMenu = screen.getByRole("combobox");

    fireEvent.change(sortMenu, {
      target: { value: "category" },
    });

    const rows = screen.getAllByRole("row").slice(1);

    expect(within(rows[0]).getByText("Grocery Store")).toBeInTheDocument();
    expect(within(rows[1]).getByText("Paycheck")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Uber Ride")).toBeInTheDocument();
  });
});