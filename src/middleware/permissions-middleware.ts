import { Request, Response, NextFunction } from "express-serve-static-core";
import expressAsyncHandler from "express-async-handler";
import SudoUser from "../resources/Sudouser/sudouser-model";

export const verifySuperAdmin = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const loggedInSudoUser = await SudoUser.findById(req.loggedInSudoUserId);
        if (!loggedInSudoUser) {
            res.json(400);
            throw new Error("Sudo user is not logged in");
        }
        if (loggedInSudoUser?.role !== 1) {
            res.status(400);
            throw new Error("Not authorized to do the task");
        }
        next();
    }
)

export const verifyAdmin = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const loggedInSudoUser = await SudoUser.findById(req.loggedInSudoUserId);
        if (!loggedInSudoUser) {
            res.json(400);
            throw new Error("Sudo user is not logged in");
        }
        if (loggedInSudoUser?.role !== 2) {
            res.status(400);
            throw new Error("Not authorized to do the task");
        }
        next();
    }
)

export const verifyCreator = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const loggedInSudoUser = await SudoUser.findById(req.loggedInSudoUserId);
        if (!loggedInSudoUser) {
            res.json(400);
            throw new Error("Sudo user is not logged in");
        }
        if (loggedInSudoUser?.role !== 3) {
            res.status(400);
            throw new Error("Not authorized to do the task");
        }
        next();
    }
)
