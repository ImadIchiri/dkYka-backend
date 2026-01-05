import { Router } from "express";
import * as controller from "../../controllers/profile";

const router = Router();

// My profile
router.get("/me", controller.myProfile);
router.put("/me", controller.updateProfile);

// Followers & Following
router.get("/followers/:userId", controller.followers);
router.get("/following/:userId", controller.following);

// Posts
router.get("/posts/:userId", controller.posts);

// Visit profile
router.get("/:username", controller.visitProfile);

// Follow / Unfollow
router.post("/follow/:userId", controller.follow);
router.delete("/unfollow/:userId", controller.unfollow);

export default router;
