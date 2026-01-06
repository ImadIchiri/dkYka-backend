import { prisma } from "../../lib/prisma";
import type { UpdateProfileInput, ProfileOutput } from "../../types/profile";

// 🔹 Mon profil
export const getMyProfile = async (userId: string): Promise<ProfileOutput | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      profile: {
        select: {
          fullName: true,
          bio: true,
          avatarUrl: true,
          coverImage: true,
        },
      },
      followers: true,
      follows: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    userId: user.id,
    username: user.username,
    fullName: user.profile?.fullName ?? null,
    bio: user.profile?.bio ?? null,
    avatarUrl: user.profile?.avatarUrl ?? null,
    coverImage: user.profile?.coverImage ?? null,
    followersCount: user.followers.length,
    followingCount: user.follows.length,
  };
};

// 🔹 Update profil sécurisé
export const updateMyProfile = async (
  userId: string,
  data: UpdateProfileInput
): Promise<ProfileOutput> => {
  // filtrer uniquement les champs définis
  const updateData: Partial<UpdateProfileInput> = {};

  if (data.fullName !== undefined) updateData.fullName = data.fullName;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;

  const updatedProfile = await prisma.profile.upsert({
    where: { userId },
    update: updateData,
    create: { userId, ...updateData },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { followers: true, follows: true },
  });

  return {
    id: updatedProfile.id,
    userId,
    username: user?.username ?? "",
    fullName: updatedProfile.fullName,
    bio: updatedProfile.bio,
    avatarUrl: updatedProfile.avatarUrl,
    coverImage: updatedProfile.coverImage,
    followersCount: user?.followers.length ?? 0,
    followingCount: user?.follows.length ?? 0,
  };
};

// 🔹 Visiter profil par username
export const getProfileByUsername = async (
  username: string
): Promise<ProfileOutput | null> => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      profile: true,
      followers: true,
      follows: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    userId: user.id,
    username: user.username,
    fullName: user.profile?.fullName ?? null,
    bio: user.profile?.bio ?? null,
    avatarUrl: user.profile?.avatarUrl ?? null,
    coverImage: user.profile?.coverImage ?? null,
    followersCount: user.followers.length,
    followingCount: user.follows.length,
  };
};

// 🔹 Follow user
export const followUser = async (userId: string, targetUserId: string) => {
  return prisma.follow.create({
    data: { followerId: userId, followingId: targetUserId },
  });
};

// 🔹 Unfollow user
export const unfollowUser = async (userId: string, targetUserId: string) => {
  return prisma.follow.delete({
    where: {
      followerId_followingId: { followerId: userId, followingId: targetUserId },
    },
  });
};

// 🔹 Followers
export const getFollowers = async (userId: string) => {
  return prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: { select: { id: true, username: true } },
    },
  });
};

// 🔹 Following
export const getFollowing = async (userId: string) => {
  return prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: { select: { id: true, username: true } },
    },
  });
};

// 🔹 Posts d’un profil
export const getUserPosts = async (userId: string) => {
  return prisma.post.findMany({
    where: { authorId: userId },
    include: { comments: true, media: true },
    orderBy: { createdAt: "desc" },
  });
};

// 🔹 Favoris (placeholder)
export const getUserFavorites = async (_userId: string) => {
  return [];
};

// 🔹 Tags (placeholder)
export const getUserTags = async (_userId: string) => {
  return [];
};
