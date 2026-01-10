import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";

// Étendre Request pour inclure user
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        profileId: string;
        role?: string; // optionnel si tu utilises role global
      };
    }
  }
}

/**
 * Middleware : Vérifie si l'utilisateur est admin du groupe
 */
export const groupAdminGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { groupId, memberId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Trouver le groupId si on supprime un membre
    let targetGroupId = groupId;
    if (!targetGroupId && memberId) {
      const member = await prisma.groupMember.findUnique({
        where: { id: memberId },
        select: { groupId: true },
      });
      if (!member) return res.status(404).json({ message: "Member not found" });
      targetGroupId = member.groupId;
    }

    if (!targetGroupId) {
      return res.status(400).json({ message: "groupId is required" });
    }

    // Vérifier si l'utilisateur est admin
    const admin = await prisma.groupMember.findFirst({
      where: {
        groupId: targetGroupId,
        userId,
        role: "ADMIN",
      },
    });

    if (!admin) {
      return res.status(403).json({ message: "Access denied: admin only" });
    }

    next();
  } catch (error: any) {
    console.error("groupAdminGuard error:", error);
    res.status(500).json({ message: "Authorization error" });
  }
};

/**
 * Middleware : Vérifie si l'utilisateur est admin ou modérateur du groupe
 */
export const requireGroupModerator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { groupId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!groupId) return res.status(400).json({ message: "groupId is required" });

    // Vérifier que le groupe existe
    const group = await prisma.communityGroup.findUnique({
      where: { id: groupId },
      select: { communityId: true },
    });

    if (!group) return res.status(404).json({ message: "Group not found" });

    // Vérifier si admin ou modérateur
    const isAdminOrModerator = await prisma.communityMember.findFirst({
      where: {
        communityId: group.communityId,
        userId,
        role: { in: ["ADMIN", "MODERATOR"] },
      },
    });

    if (!isAdminOrModerator) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error: any) {
    console.error("requireGroupModerator error:", error);
    res.status(500).json({ message: "Authorization error" });
  }
};
