import express from "express";
import { changePassword, createUser, deleteUser, forgotPassword, getAllUsers, getUserById, loginUser, logoutUser, updateUser } from "../controllers/user-controller";
import { verifyAuth } from "../middleware/verify.middleware";
import { verifyPasswordReset } from "../middleware/forgot.middleware";

const userRouter = express.Router();

userRouter.get('/users', getAllUsers)
userRouter.get('/user/:id', getUserById)
userRouter.post('/user', createUser)
userRouter.put('/user/:id', verifyAuth, updateUser)
userRouter.delete('/user/:id', verifyAuth, deleteUser)
userRouter.post('/user/login', loginUser)
userRouter.post('/user/logout', verifyAuth, logoutUser)
userRouter.post('/user/forgot-password', forgotPassword)
userRouter.post('/user/reset-password/:token', verifyPasswordReset, changePassword)

export default userRouter;
