import { Request, Response, NextFunction } from "express";

/**
 * Vérifie si l'utilisateur est admin d'une communauté
 * (ex: req.user.id injecté par auth middleware)
 */
export const communityAdminGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const communityId =
      req.params.communityId || req.body.communityId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: user not authenticated",
      });
    }

    if (!communityId) {
      return res.status(400).json({
        message: "Community ID is required",
      });
    }

    /**
     * TODO:
     * Vérifier en base si l'utilisateur est admin de la communauté
     * Exemple Prisma :
     *
     * const member = await prisma.communityMember.findFirst({
     *   where: {
     *     userId,
     *     communityId,
     *     role: "ADMIN",
     *   },
     * });
     */

    const isAdmin = true; //  mock temporaire

    if (!isAdmin) {
      return res.status(403).json({
        message: "Forbidden: admin access required",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
