import { Response } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { ISudoUser } from "./sudouser-interface";

export function generateForgotPasswordLink(
  sudouser: ISudoUser
): string {
  const token = jwt.sign(
    { sudouser_id: sudouser._id },
    process.env.JWT_SECRET!,
    { expiresIn: "10m" }
  );
  const link = `http://localhost:3000/reset-password/${token}`;
  return link;
}

export function generateJwtToken(res: Response<{}>, user: ISudoUser) {
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
