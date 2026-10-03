export const authorizationKeys = {
  all: ["authorization"] as const,
  current: () => [...authorizationKeys.all, "me"] as const,
};
