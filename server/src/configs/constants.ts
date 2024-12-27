export const permissions = [
  "write:roles",
  "read:roles",
  "update:roles",
  "delete:roles",

  "write:users",
  "read:users",
  "update:users",
  "delete:users",

  "write:displays",
  "read:displays",
  "update:displays",
  "delete:displays",

  "write:departments",
  "read:departments",
  "update:departments",
  "delete:departments",
] as const;

export const dateRegex =
  /^(0[1-9]|[12][0-9]|3[01])[-\/](0[1-9]|1[0-2])[-\/](\d{4})$/;
export const displayRegex =
  /^(createdAt|updatedAt|priority|enable)\.(asc|desc)$/;
export const trueFalseList: string[] = ["1", "0", "true", "false"];
