export type UpdateProfileInput = {
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  coverImage?: string;
  username?: string;
};

export type ProfileOutput = {
  id: string;
  userId: string;
  username: string;

  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  coverImage: string | null;

  followersCount: number;
  followingCount: number;
};
