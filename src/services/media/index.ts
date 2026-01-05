import { prisma } from "../../lib/prisma";
import type { MediaCreate, MediaUpdate } from "../../types/media/index";

export const createMedia = async (data: MediaCreate) => {
  return prisma.media.create({ data });
};

export const getAllMedia = async () => {
  return prisma.media.findMany();
};

export const getMediaById = async (id: string) => {
  return prisma.media.findUnique({ where: { id } });
};

export const updateMedia = async (id: string, data: MediaUpdate) => {
  return prisma.media.update({ where: { id }, data });
};

export const deleteMedia = async (id: string) => {
  return prisma.media.delete({ where: { id } });
};
