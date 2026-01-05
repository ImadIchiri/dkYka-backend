import { Request, Response } from "express";
import * as profileService from "../../services/profile";
import type { UpdateProfileInput } from "../../types/profile";

// ⚠️ TEMPORAIRE : userId statique
const USER_ID = "USER_UUID_TEST";

// Params typing
interface UsernameParams { username: string }
interface UserIdParams { userId: string }

// 🔹 My profile
export const myProfile = async (req: Request, res: Response) => {
  const profile = await profileService.getMyProfile(USER_ID);
  res.json(profile);
};

// 🔹 Update profile
export const updateProfile = async (req: Request<{}, {}, UpdateProfileInput>, res: Response) => {
  const profile = await profileService.updateMyProfile(USER_ID, req.body);
  res.json(profile);
};

// 🔹 Visit profile
export const visitProfile = async (req: Request<UsernameParams>, res: Response) => {
  const { username } = req.params;
  const profile = await profileService.getProfileByUsername(username);

  if (!profile) return res.status(404).json({ message: "Profile not found" });

  res.json(profile);
};

// 🔹 Follow
export const follow = async (req: Request<UserIdParams>, res: Response) => {
  const { userId } = req.params;
  const follow = await profileService.followUser(USER_ID, userId);
  res.json(follow);
};

// 🔹 Unfollow
export const unfollow = async (req: Request<UserIdParams>, res: Response) => {
  const { userId } = req.params;
  const unfollow = await profileService.unfollowUser(USER_ID, userId);
  res.json(unfollow);
};

// 🔹 Followers
export const followers = async (req: Request<UserIdParams>, res: Response) => {
  const { userId } = req.params;
  const data = await profileService.getFollowers(userId);
  res.json(data);
};

// 🔹 Following
export const following = async (req: Request<UserIdParams>, res: Response) => {
  const { userId } = req.params;
  const data = await profileService.getFollowing(userId);
  res.json(data);
};

// 🔹 Posts
export const posts = async (req: Request<UserIdParams>, res: Response) => {
  const { userId } = req.params;
  const data = await profileService.getUserPosts(userId);
  res.json(data);
};
