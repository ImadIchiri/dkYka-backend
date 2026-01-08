export type UpdateProfileInput = {
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  coverImage?: string;
  username?: string;
};

export type ProfileOutput = {
  id: string;          // profile.id
  userId: string;      // user.id
  username: string;

  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  coverImage: string | null;

  followersCount: number;
  followingCount: number;
};
