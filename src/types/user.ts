export type RolePermissionJoin = {
  permission: RBACPermission;
};

export type RBACRole = {
  id: string;
  name: string;
  description?: string | null;

  permissions: RolePermissionJoin[];
};

export type RBACPermission = {
  code: string;
  name: string;
  label: string;
  description?: string | null;
};

export type SafeProfile = {
  id: string;
  userId: string;
  username: string;
  fullName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  coverImage?: string | null;
  location?: string | null;
  isPrivate: boolean;
};

// Can be send inside 'body' to display User's Infos (withoud doing more API requests)
export type SafeUser = {
  id: string;
  email: string;
  isEmailVerified: boolean;
  roleId: string | null;
  profile?: SafeProfile | null;
};

export type TokenPayload = {
  id: string;
  permissions: string[];
};

// What will be sent to the FrontEnd
// Inside 'JWT'
export type AuthUser = {
  userId: string;
  permissions: string[];
  iat?: number; // issued at
  exp?: number;
};

export type NewUser = {
  email: string;
  password?: string;
  roleId?: string;
  profile: {
    create: {
      username: string;
      fullName?: string;
    };
  };
};

export type UpdateUserInput = {
  id: string;
  email?: string;
  password?: string;
  roleId?: string;
  isEmailVerified?: boolean;
};
