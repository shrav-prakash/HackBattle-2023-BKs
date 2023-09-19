import { Router } from "express";
import requireUser from "../middleware/requireUser.js";
import { login, register } from "../controllers/authcontroller.js";



const router = Router();

router.use(requireUser);

router.post("/login", login);
router.post("/register", register)


export default router;
