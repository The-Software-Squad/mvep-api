import expressAsyncHandler from "express-async-handler";
import { Request, Response , NextFunction } from "express-serve-static-core";

function storeProtectMiddleware(req:Request , res:Response , next:NextFunction){
     
}

export const storeMiddleware = expressAsyncHandler(storeProtectMiddleware); 
