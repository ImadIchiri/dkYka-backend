import { Router } from "express";
import * as privacyController from "../../controllers/userSettings/privacysettings";

const router = Router();

router.get("/me/privacy-settings", privacyController.getPrivacySettings);
router.put("/me/privacy-settings", privacyController.updatePrivacySettings);
router.post("/me/privacy-settings", privacyController.createPrivacySettings);
router.delete("/me/privacy-settings", privacyController.deletePrivacySettings);

export default router;
