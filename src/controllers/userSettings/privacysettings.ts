import { Request, Response } from "express";
import { PrivacySettingsService } from "../../services/userSettings/privacySettings";

const service = new PrivacySettingsService();

export const getPrivacySettings = async (req: Request, res: Response) => {
	try {
		const userId = String(req.query.userId || "");
		if (!userId) return res.status(400).json({ error: "userId is required" });

		let settings = await service.getByUser(userId);
		if (!settings) {
			settings = await service.createDefault(userId);
		}
		return res.json(settings);
	} catch (err: any) {
		const msg = String(err?.message || "");
		if (msg.includes("User not found")) {
			return res.status(404).json({ error: msg });
		}
		if (msg.includes("Profile not found")) {
			return res.status(404).json({ error: err.message });
		}
		console.error(err);
		return res.status(500).json({ error: err?.message || "Internal Server Error" });
	}
};

export const updatePrivacySettings = async (req: Request, res: Response) => {
	try {
		const { userId, ...payload } = req.body || {};
		if (!userId) return res.status(400).json({ error: "userId is required" });

		const allowedProfile = new Set(["PUBLIC", "FOLLOWERS", "PRIVATE"]);
		const allowedPost = new Set(["PUBLIC", "FOLLOWERS", "ONLY_ME"]);
		const allowedInteraction = new Set(["EVERYONE", "FOLLOWERS", "NO_ONE"]);
		const allowedStory = new Set(["PUBLIC", "FOLLOWERS", "PRIVATE"]);

		if (typeof payload.profileVisibility !== "undefined" && !allowedProfile.has(String(payload.profileVisibility))) {
			return res.status(400).json({ error: "Invalid profileVisibility" });
		}
		if (typeof payload.postVisibility !== "undefined" && !allowedPost.has(String(payload.postVisibility))) {
			return res.status(400).json({ error: "Invalid postVisibility" });
		}
		if (typeof payload.allowMessagesFrom !== "undefined" && !allowedInteraction.has(String(payload.allowMessagesFrom))) {
			return res.status(400).json({ error: "Invalid allowMessagesFrom" });
		}
		if (typeof payload.allowCommentsFrom !== "undefined" && !allowedInteraction.has(String(payload.allowCommentsFrom))) {
			return res.status(400).json({ error: "Invalid allowCommentsFrom" });
		}
		if (typeof payload.storyVisibility !== "undefined" && !allowedStory.has(String(payload.storyVisibility))) {
			return res.status(400).json({ error: "Invalid storyVisibility" });
		}
		if (typeof payload.allowStoryReplies !== "undefined" && typeof payload.allowStoryReplies !== "boolean") {
			return res.status(400).json({ error: "allowStoryReplies must be boolean" });
		}
		if (typeof payload.allowStoryReactions !== "undefined" && typeof payload.allowStoryReactions !== "boolean") {
			return res.status(400).json({ error: "allowStoryReactions must be boolean" });
		}

		const updated = await service.update(userId, payload);
		return res.json(updated);
	} catch (err: any) {
		const msg = String(err?.message || "");
		if (msg.includes("User not found") || msg.includes("Profile not found")) return res.status(404).json({ error: msg });
		return res.status(500).json({ error: err?.message || "Internal Server Error" });
	}
};

export const createPrivacySettings = async (req: Request, res: Response) => {
	try {
		const { userId, ...payload } = req.body || {};
		if (!userId) return res.status(400).json({ error: "userId is required" });

		const allowedProfile = new Set(["PUBLIC", "FOLLOWERS", "PRIVATE"]);
		const allowedPost = new Set(["PUBLIC", "FOLLOWERS", "ONLY_ME"]);
		const allowedInteraction = new Set(["EVERYONE", "FOLLOWERS", "NO_ONE"]);
		const allowedStory = new Set(["PUBLIC", "FOLLOWERS", "PRIVATE"]);

		if (typeof payload.profileVisibility !== "undefined" && !allowedProfile.has(String(payload.profileVisibility))) {
			return res.status(400).json({ error: "Invalid profileVisibility" });
		}
		if (typeof payload.postVisibility !== "undefined" && !allowedPost.has(String(payload.postVisibility))) {
			return res.status(400).json({ error: "Invalid postVisibility" });
		}
		if (typeof payload.allowMessagesFrom !== "undefined" && !allowedInteraction.has(String(payload.allowMessagesFrom))) {
			return res.status(400).json({ error: "Invalid allowMessagesFrom" });
		}
		if (typeof payload.allowCommentsFrom !== "undefined" && !allowedInteraction.has(String(payload.allowCommentsFrom))) {
			return res.status(400).json({ error: "Invalid allowCommentsFrom" });
		}
		if (typeof payload.storyVisibility !== "undefined" && !allowedStory.has(String(payload.storyVisibility))) {
			return res.status(400).json({ error: "Invalid storyVisibility" });
		}
		if (typeof payload.allowStoryReplies !== "undefined" && typeof payload.allowStoryReplies !== "boolean") {
			return res.status(400).json({ error: "allowStoryReplies must be boolean" });
		}
		if (typeof payload.allowStoryReactions !== "undefined" && typeof payload.allowStoryReactions !== "boolean") {
			return res.status(400).json({ error: "allowStoryReactions must be boolean" });
		}

		const created = await service.create(userId, payload);
		return res.status(201).json(created);
	} catch (err: any) {
		const msg = String(err?.message || "");
		if (msg.includes("User not found") || msg.includes("Profile not found")) return res.status(404).json({ error: msg });
		return res.status(500).json({ error: err?.message || "Internal Server Error" });
	}
};

export const deletePrivacySettings = async (req: Request, res: Response) => {
	try {
		const userId = String(req.body?.userId || req.query?.userId || "");
		if (!userId) return res.status(400).json({ error: "userId is required" });

		const deleted = await service.delete(userId);
		return res.json(deleted);
	} catch (err: any) {
		const msg = String(err?.message || "");
		if (msg.includes("User not found") || msg.includes("Profile not found")) return res.status(404).json({ error: msg });
		return res.status(500).json({ error: err?.message || "Internal Server Error" });
	}
};

