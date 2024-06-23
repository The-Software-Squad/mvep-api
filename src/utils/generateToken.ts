import { Response } from "express-serve-static-core";
import { ISudoUser } from "../models/sudouser.model";
import jwt from "jsonwebtoken";
function generateJwtToken(res: Response<{}>, user: ISudoUser) {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
  res.cookie("sudo_user_auth_jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
}

export default generateJwtToken;
