import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express-serve-static-core"

export const verifyPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(401).json({ message: "UnAuthorized" });
        }
        await jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
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