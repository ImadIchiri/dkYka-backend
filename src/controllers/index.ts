import type { Request, Response } from "express";
import * as commentService from "../services/index";
import { prisma } from "../lib/prisma";

/*
  Get Comments By Post
*/
export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const comments = await commentService.getCommentsByPost(postId);

    return res.status(200).json({
      success: true,
      data: comments,
      length: comments.length,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching comments",
    });
  }
};

/*
  Create Comment
*/
export const createComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;
    const authorId = req.user.id;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
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

    return res.status(201).json({
      success: true,
      data: comment,
      message: "Comment created successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error creating comment",
    });
  }
};

/*
  Update Comment (Author Only)
*/
export const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

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

    const updatedComment = await commentService.updateComment(
      commentId,
      content
    );

    return res.status(200).json({
      success: true,
      data: updatedComment,
      message: "Comment updated successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error updating comment",
    });
  }
};

/*
  Delete Comment (Author OR Post Owner)
*/
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

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
      message: error.message || "Error deleting comment",
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
    const userId = req.user.id;

    const allowedTypes = ["like", "love", "haha"];

    if (!allowedTypes.includes(type)) {
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
      message: "Reaction saved successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error reacting to comment",
    });
  }
};
