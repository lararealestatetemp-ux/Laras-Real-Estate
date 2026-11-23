export type LeadType =
  | "SELLER"
  | "PROPERTY_BUYER"
  | "REMODELING"
  | "FINANCING"
  | "GENERAL";

export type ContactReason =
  | "sell"
  | "property"
  | "remodeling"
  | "financing"
  | "general";

export type AuditEventType =
  | "SELLER_FORM_SUBMITTED"
  | "PROPERTY_INQUIRY_SUBMITTED"
  | "CONSULTATION_FORM_SUBMITTED"
  | "CONTACT_FORM_SUBMITTED";

export type LeadSubmissionKind =
  | "seller"
  | "property-inquiry"
  | "consultation"
  | "contact";
