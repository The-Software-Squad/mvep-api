import express from "express";
import {
  createSudoUser,
  deleteSudoUserById,
  getAllSudoUsers,
  getSudoUserById,
  login,
  logoutSudoUser,
  updateSudoUserById,
} from "../controllers/sudouser.controller";
import sudoUserAuthMiddleware from "../middleware/sudoUserAuth.middleware";
import roleCapacityMiddleware from "../middleware/roleCapacity.middleware";
import deleteMiddleware from "../middleware/delete-middleware";

const SudoUserRouter = express.Router();
SudoUserRouter.get("/", sudoUserAuthMiddleware , getAllSudoUsers);
SudoUserRouter.post("/", sudoUserAuthMiddleware,roleCapacityMiddleware,createSudoUser);
SudoUserRouter.post("/login" ,login);
SudoUserRouter.post("/logout" , logoutSudoUser);
SudoUserRouter.get("/:id", sudoUserAuthMiddleware ,getSudoUserById);
SudoUserRouter.put("/:id",sudoUserAuthMiddleware, roleCapacityMiddleware,updateSudoUserById);
SudoUserRouter.delete("/:id", sudoUserAuthMiddleware , deleteMiddleware,deleteSudoUserById);

export default SudoUserRouter;
