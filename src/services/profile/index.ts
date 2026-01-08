import { prisma } from "../../lib/prisma";
import type { UpdateProfileInput, ProfileOutput } from "../../types/profile";

/*
   My profile (via User)
*/
export const getMyProfile = async (userId: string): Promise<ProfileOutput | null> => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      followers: true,
      follows: true,
      user: true,
    },
  });

  if (!profile) return null;

  return {
    id: profile.id,
    userId: profile.userId,
    username: profile.username,
    fullName: profile.fullName,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    coverImage: profile.coverImage,
    followersCount: profile.followers.length,
    followingCount: profile.follows.length,
  };
};

/*
   Update my profile
*/
export const updateMyProfile = async (
  userId: string,
  data: UpdateProfileInput
): Promise<ProfileOutput> => {
  const updateData: Partial<UpdateProfileInput> = {};
  if (data.fullName !== undefined) updateData.fullName = data.fullName;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
  if (data.username !== undefined) updateData.username = data.username;

  const profile = await prisma.profile.update({
    where: { userId },
    data: updateData,
    include: {
      followers: true,
      follows: true,
      user: true,
    },
  });

  return {
    id: profile.id,
    userId: profile.userId,
    username: profile.username,
    fullName: profile.fullName,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    coverImage: profile.coverImage,
    followersCount: profile.followers.length,
    followingCount: profile.follows.length,
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
    include: {
      followers: true,
      follows: true,
      user: true,
    },
  });

  if (!profile) return null;

  return {
    id: profile.id,
    userId: profile.userId,
    username: profile.username,
    fullName: profile.fullName,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    coverImage: profile.coverImage,
    followersCount: profile.followers.length,
    followingCount: profile.follows.length,
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
