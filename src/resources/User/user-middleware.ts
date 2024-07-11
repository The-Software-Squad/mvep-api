import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express-serve-static-core";
import expressAsyncHandler from "express-async-handler";

export const verifyAuth = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies?.user_token;
            if (!token) {
                res.status(401).send({ message: "Unauthorized" });
                return;
            }
            const user = jwt.verify(token, process.env.JWT_SECRET!);
            req.user = user as string;
            next();
        } catch (err) {
            res.status(401).json({ message: "Invalid or expired token" });
        }
    }
);
