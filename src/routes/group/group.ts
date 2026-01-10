import { Router } from "express";
import group from "../../controllers/group/group";
import { groupAdminGuard } from "../../middlewears/group/group";

const router = Router();

/**
 * CRUD des groupes
 */

// Mettre à jour un groupe
// PUT /groups/:groupId
router.put("/:groupId", groupAdminGuard, group.updateGroup);

// Supprimer un groupe
// DELETE /groups/:groupId
router.delete("/:groupId", groupAdminGuard, group.deleteGroup);

/**
 * Membres du groupe
 */

// Ajouter un membre à un groupe
// POST /groups/:groupId/members
router.post("/:groupId/members", groupAdminGuard, group.addMember);

// Supprimer un membre d'un groupe
// DELETE /groups/members/:memberId
router.delete("/members/:memberId", groupAdminGuard, group.removeMember);

export default router;
