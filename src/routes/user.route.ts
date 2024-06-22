import express from "express";
import { createUser, deleteUser, forgotPassword, getAllUsers, getUserById, loginUser, updateUser } from "../controllers/user.controller";
import { verifyAuth } from "../middleware/verify.middleware";

const userRouter = express.Router();

userRouter.get('/users', getAllUsers)
userRouter.get('/user/:id', getUserById)
userRouter.post('/user', createUser)
userRouter.put('/user/:id', verifyAuth, updateUser)
userRouter.delete('/user/:id', verifyAuth, deleteUser)
userRouter.post('/user/login', loginUser)
userRouter.post('/user/forgot-password', forgotPassword)

export default userRouter;
