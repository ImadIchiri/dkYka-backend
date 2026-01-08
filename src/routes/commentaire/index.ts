import { Router } from "express";
import * as commentController from "../../controllers/commentaire";

const router = Router();

/*
  Comments Routes
*/

// Get comments by post
router.get("/post/:postId", commentController.getCommentsByPost);

// Create comment
router.post("/post/:postId", commentController.createComment);

// Update comment
router.put("/:commentId", commentController.updateComment);

// Delete comment
router.delete("/:commentId", commentController.deleteComment);

// React to comment
router.post("/:commentId/react", commentController.reactToComment);

export default router;
/// apres l'ajout de miiddleware d'authentification, il faudra proteger les routes de creation, modification, suppression et reaction aux commentaires. 
//