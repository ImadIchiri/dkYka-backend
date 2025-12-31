import { Router } from "express";
import * as postController from "../../controllers/posts/index";

const postRouter = Router();

postRouter.get("/posts",postController.getAllPosts);
postRouter.get("/posts/:id",postController.getPostsById);
postRouter.post("/posts", postController.createPosts);
postRouter.put("/posts/:id", postController.updatePosts);
postRouter.delete("/posts/:id", postController.deletePost);

export default postRouter;