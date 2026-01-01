import { prisma } from "../lib/prisma";

/*
  Get Comments By Post
*/
export const getCommentsByPost = (postId: string) => {
  return prisma.comment.findMany({
    where: { postId },
    include: {
      author: {
        select: {
          id: true,
          email: true,
        },
      },
      reactions: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/*
  Create Comment
*/
export const createComment = (data: {
  content: string;
  postId: string;
  authorId: string;
}) => {
  return prisma.comment.create({
    data,
  });
};

/*
  Update Comment
*/
export const updateComment = (commentId: string, content: string) => {
  return prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
};

/*
  Delete Comment
*/
export const deleteComment = (commentId: string) => {
  return prisma.comment.delete({
    where: { id: commentId },
  });
};

/*
  React To Comment
*/
export const reactToComment = (
  commentId: string,
  userId: string,
  type: string
) => {
  return prisma.commentReaction.upsert({
    where: {
      commentId_userId: {
        commentId,
        userId,
      },
    },
    update: {
      type,
    },
    create: {
      commentId,
      userId,
      type,
    },
  });
};
