import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../components/App";

const mockTransactions = [
  {
    id: "1",
    date: "2019-12-01",
    description: "Paycheck from Bob's Burgers",
    category: "Income",
    amount: 1000,
  },
  {
    id: "2",
    date: "2019-12-01",
    description: "South by Southwest Quinoa Bowl at Fresh & Co",
    category: "Food",
    amount: -10.55,
  },
];

describe("Display Transactions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTransactions),
      })
    );
  });

  it("fetches and displays transactions when the app loads", async () => {
    render(<App />);

    expect(
      await screen.findByText("Paycheck from Bob's Burgers")
    ).toBeInTheDocument();

    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:6001/transactions"
    );
  });

  it("displays multiple transactions returned from the server", async () => {
    render(<App />);

    expect(
      await screen.findByText("Paycheck from Bob's Burgers")
    ).toBeInTheDocument();

    expect(
      screen.getByText("South by Southwest Quinoa Bowl at Fresh & Co")
    ).toBeInTheDocument();

    expect(screen.getByText("-10.55")).toBeInTheDocument();
  });

  it("renders the transaction table headings", () => {
    render(<App />);

    expect(
  screen.getByRole("columnheader", { name: "Date" })
).toBeInTheDocument();

expect(
  screen.getByRole("columnheader", { name: "Description" })
).toBeInTheDocument();

expect(
  screen.getByRole("columnheader", { name: "Category" })
).toBeInTheDocument();

expect(
  screen.getByRole("columnheader", { name: "Amount" })
).toBeInTheDocument();
  });
});