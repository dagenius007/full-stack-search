import { render, fireEvent, screen } from "@testing-library/react";
import { vi, describe, expect, test, beforeEach, Mock } from "vitest";
import App from "../app";

let mockFetch: Mock;
describe("App test", () => {
  beforeEach(() => {
    mockFetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ hotels: [], cities: [], countries: [] }),
      })
    );

    global.fetch = mockFetch as Mock;
  });
  test("renders search input", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Search accommodation...");
    expect(input).toBeInTheDocument();
  });

  test("should update input value and show clear button when text is entered", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Search accommodation...");

    fireEvent.change(input, { target: { value: "test" } });

    expect(input).toHaveValue("test");
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
  });

  test("should clear input value and hide clear button when empty value", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Search accommodation...");

    fireEvent.change(input, { target: { value: "test" } });

    fireEvent.change(input, { target: { value: "" } });

    expect(input).toHaveValue("");
    expect(screen.queryByTestId("close-icon")).not.toBeInTheDocument();
  });

  test("should maintain clear button state after multiple changes", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Search accommodation...");

    fireEvent.change(input, { target: { value: "test" } });
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "test2" } });
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
  });

  test("should test if search api is fired at least once", async () => {
    vi.useFakeTimers();

    render(<App />);
    const input = screen.getByPlaceholderText("Search accommodation...");

    fireEvent.change(input, { target: { value: "test" } });

    await vi.runAllTimersAsync();

    expect(mockFetch).toHaveBeenCalled();
  });

  test("should load the search result section", async () => {
    mockFetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            hotels: [{ _id: "1", name: "Test Hotel" }],
            cities: [{ _id: "2", name: "Test City" }],
            countries: [{ _id: "3", name: "Test Country" }],
          }),
      })
    );
    global.fetch = mockFetch as Mock;
    vi.useFakeTimers();

    render(<App />);
    const input = screen.getByPlaceholderText("Search accommodation...");

    fireEvent.change(input, { target: { value: "test" } });

    await vi.runAllTimersAsync();

    expect(screen.getByText("Test Hotel")).toBeInTheDocument();
    expect(screen.getByTestId("search-result")).toBeInTheDocument();
  });
});
