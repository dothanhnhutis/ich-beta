import { z } from "zod";

export type GroupPermissions<T> = {
  source: string;
  permissions: { name: T; description: string }[];
};

export const groupSystemPermissions: GroupPermissions<SystemPermission>[] = [
  {
    source: "roles",
    permissions: [
      {
        name: "roles:create",
        description: "Create role",
      },
      {
        name: "roles:read",
        description: "read role",
      },
      {
        name: "roles:update",
        description: "update role",
      },
      {
        name: "roles:delete",
        description: "delete role",
      },
    ],
  },
  {
    source: "users",
    permissions: [
      {
        name: "users:create",
        description: "Create users",
      },
      {
        name: "users:read",
        description: "read users",
      },
      {
        name: "users:update",
        description: "update users",
      },
      {
        name: "users:delete",
        description: "delete users",
      },
    ],
  },
];

export const groupPlanPermissions: GroupPermissions<PlanPermission>[] = [
  {
    source: "tasks",
    permissions: [
      {
        name: "plans:tasks:create",
        description: "",
      },
    ],
  },
];

export const SYSTEM_PERMISSIONS = [
  //role
  "roles:create",
  "roles:read",
  "roles:update",
  "roles:delete",
  //user
  "users:create",
  "users:read",
  "users:update",
  "users:delete",
  //plans
  "plans:create",

  "plans:read",
  "plans:read-owner",

  "plans:update",
  "plans:update-owner",

  "plans:delete",
  "plans:delete-owner",
] as const;

export const PLAN_PERMISSIONS = [
  "plans:tasks:create",
  "plans:tasks:read",
  "plans:tasks:read-owner",
  "plans:tasks:update",
  "plans:tasks:update-owner",
  "plans:tasks:delete",
  "plans:tasks:delete-owner",

  // "plans:roles:create",
  // "plans:roles:read",
  // "plans:roles:update",
  // "plans:roles:delete",

  // "plans:members:create",
  // "plans:members:read",
  // "plans:members:update",
  // "plans:members:delete",
] as const;

const SystemPermission = z.enum(SYSTEM_PERMISSIONS);
const PlanPermission = z.enum(PLAN_PERMISSIONS);

export type SystemPermission = z.infer<typeof SystemPermission>;
export type PlanPermission = z.infer<typeof PlanPermission>;

// export const PERMISSIONS = ALL_PERMISSIONS.reduce((acc, permission) => {
//   acc[permission] = permission;
//   return acc;
// }, {} as Record<(typeof ALL_PERMISSIONS)[number], (typeof ALL_PERMISSIONS)[number]>);

export const SUPER_ADMIN_ROLE_PERMISSIONS: SystemPermission[] = [
  //role
  "roles:create",
  "roles:read",
  "roles:update",
  "roles:delete",

  //user
  "users:create",
  "users:read",
  "users:update",
  "users:delete",

  //plans
  "plans:create",
  "plans:read",
  "plans:update",
  "plans:delete",
];

export const USER_ROLE_PERMISSIONS: SystemPermission[] = [
  //plans
  "plans:create",
  "plans:update-owner",
  "plans:read-owner",
  "plans:delete-owner",
];

// export const SYSTEM_ROLES = {
//   SUPER_ADMIN: "SUPER_ADMIN",
//   APPLICATION_USER: "APPLICATION_USER",
// };
