import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"

export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req?.cookies?.token;
        if (!token) {
            return res.status(401).send({ 'message': "UnAuthorized" });
        }
        //@ts-ignore
        const user = jwt.verify(token, process.env.JWT_SECRET);
        //@ts-ignore
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}