import { Request, Response } from "express";
import * as CommunityGroupService from "../../services/group/group";
import { UpdateGroupInput } from "../../types/group/group";

/**
 * Mettre à jour un groupe
 * PUT /groups/:groupId
 */
export const updateGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    if (!groupId) return res.status(400).json({ message: "groupId is required" });

    const data: UpdateGroupInput = req.body;
    const group = await CommunityGroupService.updateGroup(groupId, data);

    res.status(200).json(group);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Supprimer un groupe
 * DELETE /groups/:groupId
 */
export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    if (!groupId) return res.status(400).json({ message: "groupId is required" });

    await CommunityGroupService.deleteGroup(groupId);
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Ajouter un membre à un groupe
 * POST /groups/:groupId/members
 */
export const addMember = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    if (!groupId) return res.status(400).json({ message: "groupId is required" });
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const member = await CommunityGroupService.addMember(groupId, userId);
    res.status(201).json(member);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Supprimer un membre d'un groupe
 * DELETE /groups/members/:memberId
 */
export const removeMember = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    if (!memberId) return res.status(400).json({ message: "memberId is required" });

    await CommunityGroupService.removeMember(memberId);
    res.status(200).json({ message: "Member removed successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Export par défaut sous forme d'objet
 * pour garder la syntaxe : group.updateGroup, group.addMember, etc.
 */
export default {
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
};
