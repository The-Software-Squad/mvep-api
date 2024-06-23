import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { CreateSudoUserDto, UpdateSudoUserDto } from "../types";
import SudoUser from "../models/sudouser.model";
/**
 * This Middleware Prevents any Operation preformed on higher role from Lower Role (Higher Role : lesser role number , lower Role : Higher Role Number)
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function RoleCapacityMiddleWare(
  req: Request<{}, {}, UpdateSudoUserDto | CreateSudoUserDto>,
  res: Response,
  next: NextFunction
) {


  const { role } = req.body;
  const loggedInSudoUser = await SudoUser.findById(req.loggedInSudoUserId);
  if (loggedInSudoUser?.role! < role || (loggedInSudoUser?.role === 1 && role===1) ){  
    return next();
  }
  res.status(400);
  throw new Error("Not Capable to Do the Operation");
}

export default expressAsyncHandler(RoleCapacityMiddleWare);
