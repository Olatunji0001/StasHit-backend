import express from "express";
import { registerRoute } from "./register.js";
import { registerRoute2 } from "./register2.js";
import { loginRoute } from "./login.js";
import { information } from "./dataSaver.js";
import { sendData } from "./sendData.js";
import { deleteData } from "./delete.js";
import { editData } from "./edit.js";
import authenticateToken from "../jwtAuthentication/auth.js";

const router = express.Router();

router.post("/register", registerRoute);
router.post("/verify", registerRoute2);
router.post("/login", loginRoute);
router.post("/save-data", authenticateToken, information);
router.get("/get-data", authenticateToken, sendData);
router.delete("/delete-data/:id", authenticateToken, deleteData);
router.put("/edit-data/:id", authenticateToken, editData)

export default router;
