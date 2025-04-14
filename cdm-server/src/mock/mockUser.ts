import { User } from "../types/user";

export const exampleUser: User = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  sub: "123e4567-e89b-12d3-a456-426614174000",
  createdTimestamp: 1690000000000,
  username: "john.doe",
  enabled: true,
  totp: false,
  emailVerified: true,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  attributes: {
    department: ["IT"],
    role: ["admin"],
  },
  disableableCredentialTypes: [],
  requiredActions: [],
  notBefore: 0,
  access: {
    manageGroupMembership: true,
    view: true,
    mapRoles: true,
    impersonate: true,
    manage: true,
  },
  realmRoles: ["user", "admin"],
  clientRoles: {
    "my-client-app": ["viewer", "editor"],
  },
  groups: ["/company/engineering"],
  federatedIdentities: [],
  serviceAccountClientId: null,
  credentials: [
    {
      type: "password",
      createdDate: 1690000000000,
    },
  ],
};

export function findUserById(userId: string) {
  return Promise.resolve(
    userId === "123e4567-e89b-12d3-a456-426614174000" ? exampleUser : null
  );
}

export function findUserByEmail(email: string) {
  return Promise.resolve(email === exampleUser.email ? exampleUser : null);
}
