import { Request, Response, NextFunction } from "express-serve-static-core";
import expressAsyncHandler from "express-async-handler";
import SudoUser from "../Sudouser/sudouser-model";

async function ProtectRegion(req:Request , res:Response , next:NextFunction){
     const loggedInSudoUser = await SudoUser.findById(req.loggedInSudoUserId);
     if(!loggedInSudoUser){
           res.json(400);
           throw new Error("sudo user is not logged in");
     }
     if(loggedInSudoUser?.role!==1){
     	 res.status(400);
     	 throw new Error("not authorized to do the task");
     }
     next();
}
export const protectRegionMiddleware = expressAsyncHandler(ProtectRegion);
