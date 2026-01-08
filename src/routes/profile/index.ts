import { Router } from "express";
import * as controller from "../../controllers/profile";

const router = Router();

// My profile
router.get("/me", controller.myProfile);
router.put("/me", controller.updateProfile);

// Followers / Following / Posts
router.get("/followers/:profileId", controller.followers);
router.get("/following/:profileId", controller.following);
router.get("/posts/:profileId", controller.posts);

// Visit profile
router.get("/:username", controller.visitProfile);

// Follow system
router.post("/follow/:profileId", controller.follow);
router.delete("/unfollow/:profileId", controller.unfollow);

export default router;
