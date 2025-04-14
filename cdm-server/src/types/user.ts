export interface User {
  id: string;
  sub?: string;
  createdTimestamp?: number;
  username?: string;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  enabled?: boolean;
  totp?: boolean;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  attributes?: Record<string, string[]>; // Custom attributes (e.g., department, role)
  disableableCredentialTypes: string[];
  requiredActions: string[];
  notBefore?: number;
  access?: {
    manageGroupMembership: boolean;
    view: boolean;
    mapRoles: boolean;
    impersonate: boolean;
    manage: boolean;
  };
  realmRoles?: string[]; // Roles at the realm level
  clientRoles?: Record<string, string[]>; // Roles for specific clients
  groups?: string[]; // List of group paths
  federatedIdentities?: any[]; // External identity providers (empty if none)
  serviceAccountClientId?: string | null;
  credentials?: {
    type: string;
    createdDate?: number;
  }[];
}
