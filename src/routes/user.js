import { Router } from "express";
import requireUser from "../middleware/requireUser";
import { login, register } from "../controllers/authcontroller";
import requireUser from "../middleware/requireUser";



const router = Router();

router.use(requireUser);

router.post("/login", login);
router.post("/register", register)


export default router;