import { prisma } from "../../lib/prisma";

/*
  Get Comments By Post
*/
export const getCommentsByPost = async (postId: string) => {
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
      reactions: {
        select: {
          id: true,
          type: true,
          userId: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return comments.map(comment => ({
    ...comment,
    authorEmail: comment.author.user.email,
  }));
};


/*
  Create Comment
*/
export const createComment = (data: {
  content: string;
  postId: string;
  authorId: string;
}) => {
  return prisma.comment.create({ data });
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
  type: "like" | "love" | "haha"
) => {
  return prisma.commentReaction.upsert({
    where: {
      commentId_userId: {
        commentId,
        userId,
      },
    },
    update: { type },
    create: {
      commentId,
      userId,
      type,
    },
  });
};
