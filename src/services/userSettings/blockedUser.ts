// src/services/blockedUser.ts
import { prisma } from "../../lib/prisma";

export class BlockedUserService {
  private async getProfileIdByUserId(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) throw new Error("Profile not found for given userId");
    return profile.id;
  }

  async block(userId: string, blockedUserId: string) {
    const blockerId = await this.getProfileIdByUserId(userId);
    const blockedId = await this.getProfileIdByUserId(blockedUserId);

    const existing = await prisma.storyBlock.findFirst({
      where: { blockerId, blockedId },
    });
    if (existing) return existing;

    return prisma.storyBlock.create({ data: { blockerId, blockedId } });
  }

  async unblock(userId: string, blockedUserId: string) {
    const blockerId = await this.getProfileIdByUserId(userId);
    const blockedId = await this.getProfileIdByUserId(blockedUserId);

    return prisma.storyBlock.deleteMany({ where: { blockerId, blockedId } });
  }

  async isBlocked(userId: string, otherUserId: string): Promise<boolean> {
    const a = await this.getProfileIdByUserId(userId);
    const b = await this.getProfileIdByUserId(otherUserId);

    const block = await prisma.storyBlock.findFirst({
      where: {
        OR: [
          { blockerId: a, blockedId: b },
          { blockerId: b, blockedId: a },
        ],
      },
    });
    return !!block;
  }
}