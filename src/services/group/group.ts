import { prisma } from "../../lib/prisma";
import { UpdateGroupInput } from "../../types/group/group";

/**
 * Mettre à jour un groupe
 */
export const updateGroup = async (groupId: string, data: UpdateGroupInput) => {
  return await prisma.communityGroup.update({
    where: { id: groupId },
    data: {
      name: data.name,
      description: data.description ?? null,
      coverImage: data.coverImage ?? null,
      visibility: data.visibility,
    },
  });
};

/**
 * Supprimer un groupe
 */
export const deleteGroup = async (groupId: string) => {
  return await prisma.communityGroup.delete({
    where: { id: groupId },
  });
};

/**
 * Ajouter un membre à un groupe
 */
export const addMember = async (groupId: string, userId: string) => {
  return await prisma.groupMember.create({
    data: {
      groupId,
      userId,
      role: "MEMBER", // par défaut, tu peux changer si tu veux
    },
  });
};

/**
 * Supprimer un membre d'un groupe
 */
export const removeMember = async (memberId: string) => {
  return await prisma.groupMember.delete({
    where: { id: memberId },
  });
};
