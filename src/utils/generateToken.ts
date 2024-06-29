import { Response } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user-model";

function generateJwtToken(res: Response,user:IUser) {
  const token = jwt.sign({ userId: user._id, email: user?.email}, process.env.JWT_SECRET!, {
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