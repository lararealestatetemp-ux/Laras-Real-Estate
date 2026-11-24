import { createElement } from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { PropertyInquiryForm } from "@/components/forms/PropertyInquiryForm";
import { PropertyGallery } from "@/components/property/PropertyGallery";

const { notFoundMock } = vi.hoisted(() => ({
  notFoundMock: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/navigation", () => ({ notFound: notFoundMock }));

const images = [
  { src: "/front.jpg", alt: "Front of property" },
  { src: "/kitchen.jpg", alt: "Property kitchen" },
  { src: "/yard.jpg", alt: "Property yard" },
];

beforeEach(() => {
  vi.restoreAllMocks();
});

test("gallery changes the primary image from accessible thumbnail buttons", async () => {
  const user = userEvent.setup();
  const view = render(
    createElement(PropertyGallery, { images, title: "Test House" }),
  );

  const primaryImage = screen.getByRole("img", {
    name: "Front of property",
  });
  expect(primaryImage).not.toHaveAttribute("loading", "lazy");
  expect(
    view.container.querySelector('img[src="/kitchen.jpg"]'),
  ).toHaveAttribute("loading", "lazy");

  await user.click(
    screen.getByRole("button", { name: "View image 2 of 3: Property kitchen" }),
  );

  expect(screen.getByRole("img", { name: "Property kitchen" })).toHaveAttribute(
    "data-primary",
    "true",
  );
});

test("inquiry form has labeled fields and submits the required payload", async () => {
  const user = userEvent.setup();
  const fetchMock = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(
      Response.json({ ok: true, correlationId: "c-1" }, { status: 200 }),
    );
  render(
    createElement(PropertyInquiryForm, {
      propertySlug: "test-house",
      propertyTitle: "Test House",
    }),
  );

  await user.type(screen.getByLabelText("First name (required)"), "Ada");
  await user.type(screen.getByLabelText("Last name (required)"), "Lovelace");
  await user.type(screen.getByLabelText("Email (required)"), "ada@example.com");
  await user.type(screen.getByLabelText("Phone"), "555-0100");
  await user.type(
    screen.getByLabelText("Message (required)"),
    "I would like more information.",
  );
  await user.click(screen.getByRole("button", { name: "Send Inquiry" }));

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/leads/property-inquiry",
      expect.objectContaining({ method: "POST" }),
    );
  });
  const request = fetchMock.mock.calls[0][1];
  expect(JSON.parse(String(request?.body))).toEqual({
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    phone: "555-0100",
    message: "I would like more information.",
    company: "",
    propertySlug: "test-house",
  });
  expect(
    await screen.findByText("Thank you. Your inquiry has been sent."),
  ).toBeInTheDocument();
  expect(screen.getByLabelText("Company")).toHaveAttribute("tabindex", "-1");
});

test("inquiry form preserves values and reports a failed request", async () => {
  const user = userEvent.setup();
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    Response.json(
      {
        ok: false,
        correlationId: "c-2",
        error:
          "We could not send your message right now. Please call 936-208-3019.",
      },
      { status: 503 },
    ),
  );
  render(
    createElement(PropertyInquiryForm, {
      propertySlug: "test-house",
      propertyTitle: "Test House",
    }),
  );

  const firstName = screen.getByLabelText("First name (required)");
  await user.type(firstName, "Ada");
  await user.type(screen.getByLabelText("Last name (required)"), "Lovelace");
  await user.type(screen.getByLabelText("Email (required)"), "ada@example.com");
  await user.type(screen.getByLabelText("Message (required)"), "Please call.");
  await user.click(screen.getByRole("button", { name: "Send Inquiry" }));

  expect(
    await screen.findByText(
      "We could not send your message right now. Please call 936-208-3019.",
    ),
  ).toBeInTheDocument();
  expect(firstName).toHaveValue("Ada");
});

test("property detail renders listing facts, inquiry, and financing when available", async () => {
  const pageModule = await import("@/app/properties/[slug]/page");
  const page = await pageModule.default({
    params: Promise.resolve({ slug: "placeholder-family-house" }),
  });

  render(page);

  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Modern Home in Livingston",
    }),
  ).toBeInTheDocument();
  expect(screen.getByText(/\$285,000/)).toBeInTheDocument();
  expect(screen.getByRole("list", { name: /basic details/i })).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { level: 2, name: "Property features" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Contact About This Property" }),
  ).toHaveAttribute("href", "#inquiry");
  expect(
    screen.getByRole("link", { name: "Apply for Financing" }),
  ).toHaveAttribute("href", "/financing#financing-inquiry");
  expect(
    screen.getByRole("heading", { level: 2, name: "Ask About This Property" }),
  ).toBeInTheDocument();
  expect(document.querySelector("section#inquiry")).not.toBeNull();
});

test("property detail omits financing when owner financing is unavailable", async () => {
  const pageModule = await import("@/app/properties/[slug]/page");
  const page = await pageModule.default({
    params: Promise.resolve({ slug: "placeholder-residential-land" }),
  });

  render(page);

  expect(
    screen.queryByRole("link", { name: "Apply for Financing" }),
  ).not.toBeInTheDocument();
});

test("property detail calls notFound for missing and unavailable slugs", async () => {
  const pageModule = await import("@/app/properties/[slug]/page");

  await expect(
    pageModule.default({
      params: Promise.resolve({ slug: "does-not-exist" }),
    }),
  ).rejects.toThrow("NEXT_NOT_FOUND");
  await expect(
    pageModule.default({
      params: Promise.resolve({ slug: "placeholder-unavailable-house" }),
    }),
  ).rejects.toThrow("NEXT_NOT_FOUND");
  expect(notFoundMock).toHaveBeenCalledTimes(2);
});

test("property metadata uses only the listing title and description", async () => {
  const pageModule = (await import(
    "@/app/properties/[slug]/page"
  )) as unknown as {
    generateMetadata(input: {
      params: Promise<{ slug: string }>;
    }): Promise<{ title: string; description: string }>;
  };

  await expect(
    pageModule.generateMetadata({
      params: Promise.resolve({ slug: "placeholder-family-house" }),
    }),
  ).resolves.toEqual(
    expect.objectContaining({
      title: "Modern Home in Livingston",
      description: expect.stringMatching(/Development placeholder listing/i),
    }),
  );
});
