import { ISudoUser } from "../models/sudouser-model";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user-model";
export default function generateForgotPasswordLink(
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

export function generateUserForgotPasswordLink(
  user: IUser
): string {
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "10m" }
  );
  const link = `http://localhost:3000/reset-password/${token}`;
  return link;
}
