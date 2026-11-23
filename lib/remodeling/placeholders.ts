export const REMODELING_SERVICE_PLACEHOLDERS = [
  {
    id: "kitchen",
    label: "Kitchen remodeling (placeholder)",
    awaitingOwnerApproval: true,
  },
  {
    id: "bath",
    label: "Bathroom remodeling (placeholder)",
    awaitingOwnerApproval: true,
  },
  {
    id: "flooring",
    label: "Flooring (placeholder)",
    awaitingOwnerApproval: true,
  },
] as const;

export const BEFORE_AFTER_PLACEHOLDERS = [
  {
    id: "demo-1",
    before: {
      src: "https://picsum.photos/seed/before1/800/600",
      alt: "Placeholder before image",
    },
    after: {
      src: "https://picsum.photos/seed/after1/800/600",
      alt: "Placeholder after image",
    },
  },
] as const;
