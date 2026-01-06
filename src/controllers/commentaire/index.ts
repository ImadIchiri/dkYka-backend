import type { Request, Response } from "express";
import * as commentService from "../../services/commentaire";
import { prisma } from "../../lib/prisma";
import { getIO } from "../../socket"; 

// à enlevé après

declare global {
  namespace Express {
    interface User {
      id: string;
    }

    interface Request {
      user?: User;
      email?: string;
    }
  }
}

/*
  Get Comments By Post
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

    res.status(200).json({
      success: true,
      data: comments,
      length: comments.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
  Create Comment ( REALTIME SOCKET)
*/
export const createComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;
    const authorId = req.user?.id;
    if (!authorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
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

    // Création en base
    const comment = await commentService.createComment({
      content,
      postId,
      authorId,
    });

    // EMIT SOCKET.IO (REALTIME)
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
  Update Comment (Author only)
*/
export const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: "commentId is required",
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

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
  Delete Comment (Author or Post Owner)
*/
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: "commentId is required",
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

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
  React To Comment
*/
export const reactToComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { type } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: "commentId is required",
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

    res.status(200).json({
      success: true,
      data: reaction,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
