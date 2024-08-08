import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserList from "./UserList";

global.fetch = require("jest-fetch-mock");

describe("UserList component", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test("displays loading state initially, then shows users after fetch", async () => {
    fetch.mockResponseOnce(
      JSON.stringify([
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Doe" },
      ])
    );

    render(<UserList />);

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument()
    );

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
  });

  test("displays error message when fetch fails", async () => {
    fetch.mockReject(new Error("Something went wrong!"));

    render(<UserList />);

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument()
    );

    expect(
      screen.getByText(/Error: Something went wrong!/i)
    ).toBeInTheDocument();
  });

  test("updates user list based on search query", async () => {
    fetch.mockResponseOnce(
      JSON.stringify([
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Doe" },
      ])
    );

    render(<UserList />);

    await waitFor(() =>
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument()
    );

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Search users");
    fireEvent.change(searchInput, { target: { value: "John" } });

    expect(screen.queryByText(/Jane Doe/i)).not.toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  test("displays no users when search query does not match any user", async () => {
    fetch.mockResponseOnce(
      JSON.stringify([
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Doe" },
      ])
    );

    render(<UserList />);

    await waitFor(() =>
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument()
    );

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Search users");
    fireEvent.change(searchInput, { target: { value: "None" } });

    expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Jane Doe/i)).not.toBeInTheDocument();
  });

  test("displays no users if API returns an empty array", async () => {
    fetch.mockResponseOnce(JSON.stringify([]));

    render(<UserList />);

    await waitFor(() =>
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument()
    );

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});
