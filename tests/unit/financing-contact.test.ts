import { createElement } from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactPage from "@/app/contact/page";
import FinancingPage from "@/app/financing/page";
import { BUSINESS_PHONE } from "@/lib/constants";

test("financing page states only conditional availability and offers an inquiry form", () => {
  const { container } = render(createElement(FinancingPage));

  expect(
    screen.getByRole("heading", { level: 1, name: "Financing" }),
  ).toBeVisible();
  expect(
    screen.getByText(
      "Financing may be available on selected properties and projects.",
    ),
  ).toBeVisible();
  expect(
    screen.getByText("Owner financing may be available on select listings."),
  ).toBeVisible();
  expect(
    screen.getByRole("heading", { level: 2, name: "Ask about financing" }),
  ).toBeVisible();
  expect(container.querySelector('input[name="reason"]')).toHaveValue(
    "financing",
  );
});

test("financing inquiry posts to the contact lead route with a locked reason", async () => {
  const user = userEvent.setup();
  const fetchMock = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response(JSON.stringify({ ok: true })));

  render(createElement(FinancingPage));

  await user.type(screen.getByLabelText(/First name/), "Ana");
  await user.type(screen.getByLabelText(/Last name/), "Lara");
  await user.type(screen.getByLabelText(/Email/), "ana@example.com");
  await user.type(screen.getByLabelText(/Message/), "Is financing available?");
  await user.click(screen.getByRole("button", { name: "Send Inquiry" }));

  await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
  expect(fetchMock).toHaveBeenCalledWith(
    "/api/leads/contact",
    expect.objectContaining({
      method: "POST",
      body: expect.stringContaining('"reason":"financing"'),
    }),
  );

  fetchMock.mockRestore();
});

test("contact page presents only the phone contact path and form", () => {
  const { container } = render(createElement(ContactPage));

  expect(screen.getByRole("link", { name: BUSINESS_PHONE })).toHaveAttribute(
    "href",
    expect.stringMatching(/^tel:/),
  );
  expect(
    screen.getByRole("heading", { level: 2, name: "Send a message" }),
  ).toBeVisible();
  expect(container.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
  expect(screen.queryByText(/map|hours|facebook/i)).not.toBeInTheDocument();
});
