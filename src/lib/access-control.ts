import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "impersonate",
    "delete",
    "set-password",
  ],
  session: ["list", "revoke", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "impersonate",
    "delete",
    "set-password",
  ],
  session: ["list", "revoke", "delete"],
});

export const user = ac.newRole({
  // Define limited permissions for regular users
  user: [],
  session: [],
});

export const member = ac.newRole({
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "impersonate",
    "delete",
    "set-password",
  ],
  session: ["list", "revoke", "delete"],
});

export const client = ac.newRole({
  // Define permissions for client role
  user: [],
  session: [],
});

export const creator = ac.newRole({
  // Define permissions for creator role
  user: [],
  session: [],
});
