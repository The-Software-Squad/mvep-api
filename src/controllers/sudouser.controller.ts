import expressAsyncHandler from "express-async-handler";

import { Request ,Response ,NextFunction } from "express";
import logger from "../utils/logger";
export const getAllSudoUsers = expressAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    logger.info("Get all sudo users has called");
    return;
});

export const getSudoUserById = expressAsyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    logger.info("Get sudo user by Id  has called");
    return;
});

export const createSudoUser = expressAsyncHandler(async(req:Request , res:Response , next:NextFunction)=>{
     logger.info("create a new Sudo user");
})