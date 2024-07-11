import { Response } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { IUser } from "./user-interface";


export function generateUserForgotPasswordLink(
    user: IUser
): string {
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: "10m" }
    );
    const link = `http://localhost:3000/reset-password/${token}`;
    return link;
}

export function generateUserJwtToken(res: Response<{}>, user: IUser) {
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
    });
    res.cookie("user_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
    });
}
