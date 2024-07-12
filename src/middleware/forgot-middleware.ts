import { NextFunction, Request, Response } from "express-serve-static-core";
import jwt from "jsonwebtoken";

export const verifyPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(401).json({ message: "UnAuthorized" });
        }
        jwt.verify(token, process.env.JWT_SECRET!, (err:any, decoded:any) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).send({ error: "Token has expired" });
                } else {
                    return res.status(401).send({ error: "Invalid token" });
                }
            }
            req.user = decoded as string;
            next();
        });

    } catch (err) {
        console.log(err)
        return res.status(500).send('Internal Server Error');
    }
}