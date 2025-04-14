import { Models } from "appwrite";
import { Dispatch, SetStateAction } from "react";

export type User = Models.User<Models.Preferences>;

// export interface User {
//   id: string;
//   sub?: string;
//   createdTimestamp?: number;
//   username?: string;
//   name?: string;
//   preferred_username?: string;
//   given_name?: string;
//   family_name?: string;
//   enabled?: boolean;
//   totp?: boolean;
//   emailVerified: boolean;
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   attributes?: Record<string, string[]>; // Custom attributes (e.g., department, role)
//   disableableCredentialTypes: string[];
//   requiredActions: string[];
//   notBefore?: number;
//   access?: {
//     manageGroupMembership: boolean;
//     view: boolean;
//     mapRoles: boolean;
//     impersonate: boolean;
//     manage: boolean;
//   };
//   realmRoles?: string[]; // Roles at the realm level
//   clientRoles?: Record<string, string[]>; // Roles for specific clients
//   groups?: string[]; // List of group paths
//   federatedIdentities?: any[]; // External identity providers (empty if none)
//   serviceAccountClientId?: string | null;
//   credentials?: {
//     type: string;
//     createdDate?: number;
//   }[];
// }

export interface AuthSettings {
  rememberMe?: boolean;
  email?: string;
  password?: string;
  companyId?: string;
}

export type NonNullableFields<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

export type DialogEditProps<T> = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
} & (
  | {
      mode: "create";
    }
  | {
      mode: "update";
      data: T | undefined | null;
    }
);
