export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const,
  authorization: () => [...authKeys.all, "authorization"] as const,
};
