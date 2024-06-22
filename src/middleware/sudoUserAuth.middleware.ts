import { Request,Response,NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
function sudoUserProtectMiddleWare(req:Request , res:Response , next:NextFunction){

}
export default expressAsyncHandler(sudoUserProtectMiddleWare);