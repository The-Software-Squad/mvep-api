import { Request, Response, NextFunction } from "express-serve-static-core";
import SudoUser from "./sudouser-model";
import expressAsyncHandler from "express-async-handler";
import { CreateSudoUserDto } from "../../types";
import jwt from "jsonwebtoken";
import logger from "../../utils/logger";

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

/**
 * This Middleware Prevents any Operation preformed on higher role from Lower Role (Higher Role : lesser role number , lower Role : Higher Role Number)
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function RoleCapacityMiddleWare(
  req: Request<{}, {}, CreateSudoUserDto>,
  res: Response,
  next: NextFunction
) {
  const { role } = req.body;
  const loggedInSudoUser = await SudoUser.findById(req.loggedInSudoUserId);
  if (
    loggedInSudoUser?.role! < role ||
    (loggedInSudoUser?.role === 1 && role === 1)
  ) {
    return next();
  }
  res.status(400);
  throw new Error("Not Capable to Do the Operation");
}

/**
 * This Simple MiddleWare Protects API from not Logged in Users
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function sudoUserProtectMiddleWare(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token;
  token = req.cookies.sudo_user_auth_jwt;
   if (!token) {
    res.status(400);
    throw new Error("Cookie Does not Exist");
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;
    req.loggedInSudoUserId = decoded.userId as string;
    next();
    return;
  } catch (error) {
    res.status(400);
    throw new Error("Invalid token");
  }
}

export const sudouserProtectMiddleWare = expressAsyncHandler(
  sudoUserProtectMiddleWare
);

export const rolecapacityidMiddleware = expressAsyncHandler(
  roleCapacityIDMiddleware
);

export const rolecapacityMiddleware = expressAsyncHandler(
  RoleCapacityMiddleWare
);
