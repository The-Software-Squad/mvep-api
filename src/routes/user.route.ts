import express from "express";
import { createUser, deleteUser, forgotPassword, getAllUsers, getUserById, loginUser, updateUser } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get('/users', getAllUsers)
userRouter.get('/user/:id', getUserById)
userRouter.post('/user', createUser)
userRouter.put('/user/:id', updateUser)
userRouter.delete('/user/:id', deleteUser)
userRouter.post('/user/login', loginUser)
userRouter.post('/user/forgot-password', forgotPassword)

export default userRouter;
