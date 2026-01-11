import { prisma } from "../../lib/prisma";
import type { UpdateProfileInput, ProfileOutput } from "../../types/profile";

/*
   My profile (via User)
*/
export const getMyProfile = async (userId: string): Promise<ProfileOutput | null> => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) return null;

  const followersCount = await prisma.follow.count({
    where: { followingId: profile.id },
  });

  const followingCount = await prisma.follow.count({
    where: { followerId: profile.id },
  });

  return {
    id: profile.id,
    userId: profile.userId,
    username: profile.username,
    fullName: profile.fullName,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    coverImage: profile.coverImage,
    followersCount,
    followingCount,
  };
};

/*
   Update my profile (upsert pour éviter l'erreur si pas de profil)
*/
export const updateMyProfile = async (
  userId: string,
  data: UpdateProfileInput
): Promise<ProfileOutput> => {
  const updateData: Partial<UpdateProfileInput> = {};
  const createData: any = { userId };

  if (data.fullName !== undefined) {
    updateData.fullName = data.fullName;
    createData.fullName = data.fullName;
  }
  if (data.bio !== undefined) {
    updateData.bio = data.bio;
    createData.bio = data.bio;
  }
  if (data.avatarUrl !== undefined) {
    updateData.avatarUrl = data.avatarUrl;
    createData.avatarUrl = data.avatarUrl;
  }
  if (data.coverImage !== undefined) {
    updateData.coverImage = data.coverImage;
    createData.coverImage = data.coverImage;
  }
  if (data.username !== undefined) {
    updateData.username = data.username;
    createData.username = data.username;
  }

  const profile = await prisma.profile.upsert({
    where: { userId },
    update: updateData,
    create: createData,
  });

  const followersCount = await prisma.follow.count({
    where: { followingId: profile.id },
  });

  const followingCount = await prisma.follow.count({
    where: { followerId: profile.id },
  });

  return {
    id: profile.id,
    userId: profile.userId,
    username: profile.username,
    fullName: profile.fullName,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    coverImage: profile.coverImage,
    followersCount,
    followingCount,
  };
};

/*
   Visit profile by username
*/
export const getProfileByUsername = async (
  username: string
): Promise<ProfileOutput | null> => {
  const profile = await prisma.profile.findUnique({
    where: { username },
  });

  if (!profile) return null;

  const followersCount = await prisma.follow.count({
    where: { followingId: profile.id },
  });

  const followingCount = await prisma.follow.count({
    where: { followerId: profile.id },
  });

  return {
    id: profile.id,
    userId: profile.userId,
    username: profile.username,
    fullName: profile.fullName,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    coverImage: profile.coverImage,
    followersCount,
    followingCount,
  };
};

/*
   Follow / Unfollow (PROFILE ↔ PROFILE)
*/
export const followUser = async (myProfileId: string, targetProfileId: string) => {
  return prisma.follow.create({
    data: {
      followerId: myProfileId,
      followingId: targetProfileId,
    },
  });
};

export const unfollowUser = async (myProfileId: string, targetProfileId: string) => {
  return prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: myProfileId,
        followingId: targetProfileId,
      },
    },
  });
};

/*
   Followers / Following
*/
export const getFollowers = async (profileId: string) => {
  return prisma.follow.findMany({
    where: { followingId: profileId },
    include: {
      follower: {
        select: { id: true, username: true, avatarUrl: true },
      },
    },
  });
};

export const getFollowing = async (profileId: string) => {
  return prisma.follow.findMany({
    where: { followerId: profileId },
    include: {
      following: {
        select: { id: true, username: true, avatarUrl: true },
      },
    },
  });
};

/*
   Posts d’un profil
*/
export const getUserPosts = async (profileId: string) => {
  return prisma.post.findMany({
    where: { authorId: profileId },
    include: {
      comments: true,
      media: true,
    },
    orderBy: { createdAt: "desc" },
  });
};
