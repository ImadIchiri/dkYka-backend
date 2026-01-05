export type UpdateProfileInput = {
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  coverImage?: string;
  username?: string;
};

// Pour retourner un profil
export type ProfileOutput = {
  id: string;
  userId: string;
  fullName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  coverImage?: string | null;
  username: string;
  followersCount?: number;
  followingCount?: number;
};
