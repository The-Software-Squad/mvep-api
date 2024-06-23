import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"

export const verifyPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(401).json({ message: "UnAuthorized" });
        }
        //@ts-ignore
        await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).send({ error: "Token has expired" });
                } else {
                    return res.status(401).send({ error: "Invalid token" });
                }
            }
            //@ts-ignore
            req.user = decoded;
            next();
        });

    } catch (err) {
        console.log(err)
        return res.status(500).send('Internal Server Error');
    }
}