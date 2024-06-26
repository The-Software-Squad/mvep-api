import { Request, Response, NextFunction } from "express-serve-static-core";
import SudoUser from "../models/sudouser-model";
import expressAsyncHandler from "express-async-handler";

/**
 * This Middleware Prevents any Operation preformed on higher role from Lower Role (Higher Role : lesser role number , lower Role : Higher Role Number)
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function roleCapacityIDMiddleware(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  const toBeDeletedSudoUserId = req.params.id;
  const toBeDeletedSudoUser = await SudoUser.findById(toBeDeletedSudoUserId);

  const loggedInSudoUser = await SudoUser.findById(req.loggedInSudoUserId);
  if (
    loggedInSudoUser?.role! < toBeDeletedSudoUser?.role! ||
    (loggedInSudoUser?.role === 1 && toBeDeletedSudoUser?.role === 1)
  ) {
    return next();
  }
  res.status(400);
  throw new Error("Not Capable to Do the Operation");
}

export default expressAsyncHandler(roleCapacityIDMiddleware);
