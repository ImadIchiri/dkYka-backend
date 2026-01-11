import { Request, Response } from "express";
import * as profileService from "../../services/profile";
import type { UpdateProfileInput } from "../../types/profile";

// temporaire (sans auth middleware)
const USER_ID = "USER_UUID_TEST";

// --------------------
// Types des params
// --------------------
interface UsernameParams {
  username: string;
}

interface ProfileIdParams {
  profileId: string;
}

// --------------------
// Controllers
// --------------------

export const myProfile = async (_req: Request, res: Response) => {
  try {
    const profile = await profileService.getMyProfile(USER_ID);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err: any) {
    console.error("myProfile error:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

export const updateProfile = async (
  req: Request<{}, {}, UpdateProfileInput>,
  res: Response
) => {
  try {
    const profile = await profileService.updateMyProfile(USER_ID, req.body);
    res.json(profile);
  } catch (err: any) {
    console.error("updateProfile error:", err);
    // Renvoie l'erreur réelle pour debug
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

export const visitProfile = async (
  req: Request<UsernameParams>,
  res: Response
) => {
  try {
    const { username } = req.params;

    const profile = await profileService.getProfileByUsername(username);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err: any) {
    console.error("visitProfile error:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

export const follow = async (
  req: Request<ProfileIdParams>,
  res: Response
) => {
  try {
    const { profileId } = req.params;

    const myProfile = await profileService.getMyProfile(USER_ID);
    if (!myProfile) return res.sendStatus(404);

    const data = await profileService.followUser(myProfile.id, profileId);
    res.json(data);
  } catch (err: any) {
    console.error("follow error:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

export const unfollow = async (
  req: Request<ProfileIdParams>,
  res: Response
) => {
  try {
    const { profileId } = req.params;

    const myProfile = await profileService.getMyProfile(USER_ID);
    if (!myProfile) return res.sendStatus(404);

    const data = await profileService.unfollowUser(myProfile.id, profileId);
    res.json(data);
  } catch (err: any) {
    console.error("unfollow error:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

export const followers = async (
  req: Request<ProfileIdParams>,
  res: Response
) => {
  try {
    const { profileId } = req.params;
    const data = await profileService.getFollowers(profileId);
    res.json(data);
  } catch (err: any) {
    console.error("followers error:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

export const following = async (
  req: Request<ProfileIdParams>,
  res: Response
) => {
  try {
    const { profileId } = req.params;
    const data = await profileService.getFollowing(profileId);
    res.json(data);
  } catch (err: any) {
    console.error("following error:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

export const posts = async (
  req: Request<ProfileIdParams>,
  res: Response
) => {
  try {
    const { profileId } = req.params;
    const data = await profileService.getUserPosts(profileId);
    res.json(data);
  } catch (err: any) {
    console.error("posts error:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};
