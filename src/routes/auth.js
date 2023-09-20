import { Router } from "express";
import { login, register } from "../controllers/authcontroller.js";
import handleValidation from "../middleware/handleValidation.js";
import { loginSchema, registerSchema } from "../helpers/validationSchemas.js";


const router = Router();

router.post("/login", handleValidation(loginSchema, "body"), login);
router.post("/register", handleValidation(registerSchema, "body"), register);

export default router;
