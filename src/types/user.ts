export type RBACRole = {
  id: string;
  name: string;
  description?: string | null;
  inherits: string[];
  permissions: any[];
};

export type RBACPermission = {
  code: string;
  name: string;
  label: string;
  description: string;
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

export type SafeUser = {
  id: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  roleId: string | null;
  role?: RBACRole | null;
  profile?: SafeProfile | null;
};

export type TokenPayload = {
  id: string; // UUID string
  role: {
    id: string | null;
    name: string | undefined;
    permissions: RBACPermission[];
  };
};

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  permissions: string[];
};

export type NewUser = {
  email: string;
  password?: string;
  roleId?: string;
  isEmailVerified?: boolean;
  profile?: {
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
