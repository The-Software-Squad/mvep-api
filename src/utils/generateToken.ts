import { Response } from "express-serve-static-core";
import { ISudoUser } from "../models/sudouser-model";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user-model";

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

export function generateUserJwtToken(res: Response<{}>, user: IUser) {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
}

export default generateJwtToken;
