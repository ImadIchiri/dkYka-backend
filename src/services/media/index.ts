import { prisma } from "../../lib/prisma";
import type { MediaCreate, MediaUpdate, MediaType } from "../../types/media/index";
import { uploadToFirebase } from "../../lib/firebase";

type UploadMediaParams = {
  file: Express.Multer.File;
  ownerId: string;
  type: MediaType;

  postId?: string;
  storyId?: string;
  communityPostId?: string;
};

export const uploadAndCreateMedia = async ({
  file,
  ownerId,
  type,
  postId,
  storyId,
  communityPostId,
}: UploadMediaParams) => {
  // 1. Upload to Firebase
  const firebasePath = `media/${ownerId}/${file.originalname}`;
  const url = await uploadToFirebase(file.buffer, firebasePath);

  // 2. Save in DB
  return prisma.media.create({
    data: {
      ownerId,
      type,
      url,
      postId: postId ?? null,
      storyId: storyId ?? null,
      communityPostId: communityPostId ?? null,
    },
  });
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
