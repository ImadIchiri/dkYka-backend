import { Router } from "express";
import * as commentController from "../controllers";


const commentRoutes = Router();

// Get comments of a post
commentRoutes.get(
  "/posts/:postId/comments",
 
  commentController.getCommentsByPost
);

// Create comment
commentRoutes.post(
  "/posts/:postId/comments",
 
  commentController.createComment
);

// Update comment
commentRoutes.put(
  "/comments/:commentId",

  commentController.updateComment
);

// Delete comment
commentRoutes.delete(
  "/comments/:commentId",
 
  commentController.deleteComment
);

// React to comment
commentRoutes.post(
  "/comments/:commentId/react",
  
  commentController.reactToComment
);

export default commentRoutes;
