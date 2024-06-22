import express from "express";
import {
  createSudoUser,
  deleteSudoUserById,
  getAllSudoUsers,
  getSudoUserById,
  updateSudoUserById,
} from "../controllers/sudouser.controller";
const SudoUserRouter = express.Router();

SudoUserRouter.get("/", getAllSudoUsers);
SudoUserRouter.post("/", createSudoUser);
SudoUserRouter.get("/:id", getSudoUserById);
SudoUserRouter.put("/:id", updateSudoUserById);
SudoUserRouter.delete("/:id", deleteSudoUserById);

export default SudoUserRouter;
