import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import AccountContainer from "../../components/AccountContainer";

describe("Add Transactions", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("adds a new transaction to the frontend", async () => {
    const newTransaction = {
      id: 99,
      date: "2026-10-18",
      description: "Coffee",
      category: "Food",
      amount: "5.50",
    };

    fetch
      .mockResolvedValueOnce({
        json: async () => [],
      })
      .mockResolvedValueOnce({
        json: async () => newTransaction,
      });

    render(<AccountContainer />);

    fireEvent.change(document.querySelector('input[name="date"]'), {
      target: { value: "2026-10-18" },
    });

    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Coffee" },
    });

    fireEvent.change(screen.getByPlaceholderText("Category"), {
      target: { value: "Food" },
    });

    fireEvent.change(screen.getByPlaceholderText("Amount"), {
      target: { value: "5.50" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /add transaction/i })
    );

    expect(await screen.findByText("Coffee")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
  });

  it("sends a POST request when a transaction is submitted", async () => {
    const newTransaction = {
      id: 100,
      date: "2026-10-18",
      description: "Gas",
      category: "Transportation",
      amount: "40",
    };

    fetch
      .mockResolvedValueOnce({
        json: async () => [],
      })
      .mockResolvedValueOnce({
        json: async () => newTransaction,
      });

    render(<AccountContainer />);

    fireEvent.change(document.querySelector('input[name="date"]'), {
      target: { value: "2026-10-18" },
    });

    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Gas" },
    });

    fireEvent.change(screen.getByPlaceholderText("Category"), {
      target: { value: "Transportation" },
    });

    fireEvent.change(screen.getByPlaceholderText("Amount"), {
      target: { value: "40" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /add transaction/i })
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:6001/transactions",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: "2026-10-18",
            description: "Gas",
            category: "Transportation",
            amount: "40",
          }),
        })
      );
    });
  });
});