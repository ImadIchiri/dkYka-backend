import { prisma } from "../../lib/prisma";
import { UpdatePrivacySettingsDTO } from "../../types/userSettings/privacySettings";

export class PrivacySettingsService {
  private async getOrCreateProfileIdByUserId(userId: string) {
    const existing = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (existing) return existing.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      throw new Error("User not found for given userId");
    }

    const compactId = String(userId).replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);
    const base = compactId ? `user_${compactId}` : "user";

    for (let attempt = 0; attempt < 10; attempt++) {
      const suffix = attempt === 0 ? "" : `_${Math.random().toString(36).slice(2, 6)}`;
      const username = `${base}${suffix}`;
      try {
        const created = await prisma.profile.create({
          data: {
            userId,
            username,
          },
          select: { id: true },
        });
        return created.id;
      } catch (err: any) {
        // Unique constraint (e.g. username already taken) -> retry with a different suffix.
        if (err?.code === "P2002") continue;
        throw err;
      }
    }

    throw new Error("Could not create profile for given userId");
  }

  async createDefault(userId: string) {
    const profileId = await this.getOrCreateProfileIdByUserId(userId);
    return prisma.privacySettings.create({
      data: {
        profileId,
        profileVisibility: "PUBLIC",
        postVisibility: "PUBLIC",
        storyVisibility: "PUBLIC",
        allowMessagesFrom: "EVERYONE",
        allowCommentsFrom: "EVERYONE",
        allowStoryReplies: true,
        allowStoryReactions: true,
      },
    });
  }

  async create(userId: string, data: UpdatePrivacySettingsDTO = {}) {
    const profileId = await this.getOrCreateProfileIdByUserId(userId);
    const allowedStoryVis = new Set(["PUBLIC", "FOLLOWERS", "PRIVATE"]);

    // Base defaults
    let payload: any = {
      profileVisibility: "PUBLIC",
      postVisibility: "PUBLIC",
      storyVisibility: "PUBLIC",
      allowMessagesFrom: "EVERYONE",
      allowCommentsFrom: "EVERYONE",
      allowStoryReplies: true,
      allowStoryReactions: true,
    };

    // Override from provided data
    if (typeof data.profileVisibility !== "undefined") {
      payload.profileVisibility = data.profileVisibility;
    }
    if (typeof data.postVisibility !== "undefined") {
      payload.postVisibility = data.postVisibility;
    }
    if (typeof data.storyVisibility !== "undefined") {
      const val = String(data.storyVisibility);
      if (!allowedStoryVis.has(val)) {
        throw new Error("Invalid storyVisibility value");
      }
      payload.storyVisibility = val as any;
    }
    if (typeof data.allowMessagesFrom !== "undefined") {
      payload.allowMessagesFrom = data.allowMessagesFrom;
    }
    if (typeof data.allowCommentsFrom !== "undefined") {
      payload.allowCommentsFrom = data.allowCommentsFrom;
    }
    if (typeof data.allowStoryReplies !== "undefined") {
      payload.allowStoryReplies = data.allowStoryReplies;
    }
    if (typeof data.allowStoryReactions !== "undefined") {
      payload.allowStoryReactions = data.allowStoryReactions;
    }

    return prisma.privacySettings.create({
      data: { profileId, ...payload },
    });
  }

  async getByUser(userId: string) {
    return prisma.privacySettings.findFirst({
      where: { profile: { userId } },
    });
  }

  async update(userId: string, data: UpdatePrivacySettingsDTO) {
    const profileId = await this.getOrCreateProfileIdByUserId(userId);

    const allowedStoryVis = new Set(["PUBLIC", "FOLLOWERS", "PRIVATE"]);
    const payload: Record<string, unknown> = {};

    if (typeof data.profileVisibility !== "undefined") {
      payload.profileVisibility = data.profileVisibility;
    }
    if (typeof data.postVisibility !== "undefined") {
      payload.postVisibility = data.postVisibility;
    }
    if (typeof data.storyVisibility !== "undefined") {
      const val = String(data.storyVisibility);
      if (!allowedStoryVis.has(val)) {
        throw new Error("Invalid storyVisibility value");
      }
      payload.storyVisibility = val;
    }
    if (typeof data.allowMessagesFrom !== "undefined") {
      payload.allowMessagesFrom = data.allowMessagesFrom;
    }
    if (typeof data.allowCommentsFrom !== "undefined") {
      payload.allowCommentsFrom = data.allowCommentsFrom;
    }
    if (typeof data.allowStoryReplies !== "undefined") {
      payload.allowStoryReplies = data.allowStoryReplies;
    }
    if (typeof data.allowStoryReactions !== "undefined") {
      payload.allowStoryReactions = data.allowStoryReactions;
    }

    return prisma.privacySettings.update({
      where: { profileId },
      data: payload,
    });
  }

  async delete(userId: string) {
    const profileId = await this.getOrCreateProfileIdByUserId(userId);
    return prisma.privacySettings.delete({
      where: { profileId },
    });
  }
}