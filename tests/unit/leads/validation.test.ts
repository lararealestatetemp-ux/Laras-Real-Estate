import {
  validateConsultationInput,
  validateContactInput,
  validatePropertyInquiryInput,
  validateSellerInput,
} from "@/lib/leads/validation";

const sellerPayload = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  phone: "936-555-0100",
  propertyAddress: "123 Main",
  propertyType: "house",
  askingPrice: "100000",
  generalInfo: "Brick home",
  comments: "Flexible",
  company: "",
};

test("rejects invalid seller email", () => {
  expect(
    validateSellerInput({ ...sellerPayload, email: "not-an-email" }).success,
  ).toBe(false);
});

test("rejects unsupported seller property type", () => {
  expect(
    validateSellerInput({ ...sellerPayload, propertyType: "castle" }).success,
  ).toBe(false);
});

test("rejects seller phone numbers with fewer than ten digits", () => {
  expect(validateSellerInput({ ...sellerPayload, phone: "555-0100" }).success).toBe(
    false,
  );
});

test("accepts valid seller payload", () => {
  expect(validateSellerInput(sellerPayload).success).toBe(true);
});

test("property inquiry requires a safe property slug", () => {
  const result = validatePropertyInquiryInput({
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    phone: "936-555-0100",
    message: "Is this property available?",
    company: "",
    propertySlug: "../private",
  });

  expect(result.success).toBe(false);
});

test("accepts a valid consultation payload", () => {
  const result = validateConsultationInput({
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    phone: "936-555-0100",
    message: "I would like to discuss a kitchen remodel.",
    company: "",
  });

  expect(result.success).toBe(true);
});

test("contact requires a supported reason", () => {
  const result = validateContactInput({
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    phone: "936-555-0100",
    reason: "complaint",
    message: "Please call me.",
    company: "",
  });

  expect(result.success).toBe(false);
});
