import type { Request, Response } from "express";
import * as commentService from "../../services/commentaire";
import { prisma } from "../../lib/prisma";
import { getIO } from "../../socket";

/*
  =========================
  GET COMMENTS BY POST
  =========================
*/
export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "postId is required",
      });
    }

    const comments = await commentService.getCommentsByPost(postId);

    return res.status(200).json({
      success: true,
      data: comments,
      length: comments.length,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
  =========================
  CREATE COMMENT (TEST MODE)
  =========================
*/
export const createComment = async (req: Request, res: Response) => {
  try {
    const { content, authorId } = req.body;
    const { postId } = req.params;

    if (!authorId) {
      return res.status(400).json({
        success: false,
        message: "authorId is required (TEST MODE)",
      });
    }

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "postId is required",
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const postExists = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!postExists) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = await commentService.createComment({
      content,
      postId,
      authorId,
    });

    const io = getIO();
    io.to(`post:${postId}`).emit("comment:new", comment);

    return res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
  =========================
  UPDATE COMMENT (TEST MODE)
  =========================
*/
export const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { content, userId } = req.body;

    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: "commentId is required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required (TEST MODE)",
      });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updated = await commentService.updateComment(commentId, content);

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
  =========================
  DELETE COMMENT (TEST MODE)
  =========================
*/
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: "commentId is required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required (TEST MODE)",
      });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { post: true },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (
      comment.authorId !== userId &&
      comment.post.authorId !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await commentService.deleteComment(commentId);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
  =========================
  REACT TO COMMENT (TEST MODE)
  =========================
*/
export const reactToComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { type, userId } = req.body;

    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: "commentId is required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required (TEST MODE)",
      });
    }

    if (!["like", "love", "haha"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reaction type",
      });
    }

    const reaction = await commentService.reactToComment(
      commentId,
      userId,
      type
    );

    return res.status(200).json({
      success: true,
      data: reaction,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
