import { Router } from "express";
import AuthController from "../controller/AuthController";
import AuthValidator from "../middlewares/validator/AuthValidator";

const router = Router();

router.post("/login", AuthValidator.login, AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/me", AuthController.me);
router.post("/refresh", AuthController.refresh);

export default router;
