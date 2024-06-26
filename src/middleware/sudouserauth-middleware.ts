import { Request, Response, NextFunction } from "express-serve-static-core";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

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
export default expressAsyncHandler(sudoUserProtectMiddleWare);
