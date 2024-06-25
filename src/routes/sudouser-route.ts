import express from "express";
import {
  createSudoUser,
  deleteSudoUserById,
  forgetPassword,
  getAllSudoUsers,
  getSudoUserById,
  login,
  logoutSudoUser,
  resetPassword,
  updateSudoUserById,
} from "../controllers/sudouser-controller";
import sudoUserAuthMiddleware from "../middleware/sudouserauth-middleware";
import roleCapacityMiddleware from "../middleware/rolecapacity-middleware";
import roleCapacityIdMiddleware from "../middleware/rolecapacityid-middleware";

const SudoUserRouter = express.Router();
SudoUserRouter.get("/", sudoUserAuthMiddleware, getAllSudoUsers);
SudoUserRouter.post(
  "/",
  sudoUserAuthMiddleware,
  roleCapacityMiddleware,
  createSudoUser
);
SudoUserRouter.post("/login", login);
SudoUserRouter.post("/logout", logoutSudoUser);
SudoUserRouter.post("/forget-password", forgetPassword);
SudoUserRouter.post("/reset-password", resetPassword);
SudoUserRouter.get(
  "/:id",
  sudoUserAuthMiddleware,
  roleCapacityIdMiddleware,
  getSudoUserById
);
SudoUserRouter.put(
  "/:id",
  sudoUserAuthMiddleware,
  roleCapacityMiddleware,
  updateSudoUserById
);
SudoUserRouter.delete(
  "/:id",
  sudoUserAuthMiddleware,
  roleCapacityIdMiddleware,
  deleteSudoUserById
);

export default SudoUserRouter;
