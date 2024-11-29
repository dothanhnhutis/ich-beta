type UserStatus = "ACTIVE" | "SUSPENDED" | "DISABLED";
type UserGender = "MALE" | "FEMALE" | "OTHER" | null;
type UserMFA = {
  secretKey: string;
  lastAccess: Date;
  backupCodes: string[];
  backupCodesUsed: string[];
  createdAt: Date;
  updatedAt: Date;
};

type OauthProvider = {
  provider: string;
  providerId: string;
};

export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  roles: {
    role: {
      id: string;
      name: string;
      readOnly: boolean;
      permissions: string[];
      createdAt: Date;
      updatedAt: Date;
    };
  }[];
  usersToPlanRoles: {
    planRole: {
      id: string;
      planRoleName: string;
      planPermissions: string[];
      plan: {
        id: string;
        name: string;
      };
    };
  }[];
  status: UserStatus;
  password: string | null;
  username: string;
  birthDate: Date | null;
  gender: UserGender;
  picture: string | null;
  phoneNumber: string | null;
  mfa: UserMFA | null;
  oauthProviders: OauthProvider[];
  createdAt: Date;
  updatedAt: Date;
};

export type UserToken = {
  type: "emailVerification" | "recover" | "reActivate";
  session: string;
};
