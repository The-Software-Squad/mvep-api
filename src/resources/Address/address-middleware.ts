import { Request, Response, NextFunction } from "express-serve-static-core";
import expressAsyncHandler from "express-async-handler";
import SudoUser from "../Sudouser/sudouser-model";
import jwt, { JwtPayload } from "jsonwebtoken"

export const verifyAuthOrSudo = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies?.user_token;
            const sudoToken = req.cookies?.sudo_user_auth_jwt;
            if (token) {
                const user = jwt.verify(token, process.env.JWT_SECRET!);
                req.user = user as string;
                return next();
            }
            if (sudoToken) {
                const decoded = jwt.verify(
                    sudoToken,
                    process.env.JWT_SECRET!
                ) as JwtPayload;
                req.loggedInSudoUserId = decoded.userId as string;
                const loggedInSudoUser = await SudoUser.findById(req.loggedInSudoUserId);
                if (loggedInSudoUser?.role !== 1) {
                    res.status(403).json({ message: "Not authorized" });
                    return;
                }
                return next();
            }
            res.status(401).json({ message: "UnAuthorized" });
            return;

        } catch (err) {
            res.status(400).json({ message: "Invalid or expired token" });
        }
    }
);
