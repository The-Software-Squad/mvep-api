import { Router } from "express";
import { Controller } from "../../utils/interfaces/controller-interface";
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express-serve-static-core";
import WishList from "./wishlist-model";
import { verifySuperAdmin } from "../../middleware/permissions-middleware";
import { verifyAuth } from "./wishlist-middleware";
import User from "../User/user-model";

export default class WishListController implements Controller {
    router: Router = Router();
    path: string = "wishlist";

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', verifySuperAdmin, this.getAllWishlist)
        this.router.get('/:id', this.getWishListById);
        this.router.get('/', verifyAuth, this.getUserWishList)
        this.router.post('/', verifyAuth, this.createWishList)
    }

    private getAllWishlist = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const availableWishlist = await WishList.find();
            res.status(200);
            res.json({
                result: {
                    data: availableWishlist
                }
            })
        }
    )

    private getWishListById = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const ID = req.params?.id;
            if (!ID) {
                res.status(400);
                throw new Error("WishList ID required");
            }
            const fetchedWishList = await WishList.findById(ID);
            if (!fetchedWishList) {
                res.status(404);
                throw new Error("No WishList Found");
            }
            res.status(200).send(
                {
                    results: {
                        data: fetchedWishList
                    }
                }
            )
        }
    )

    private getUserWishList = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const user: any = req.user;
            const availableWishlist = await WishList.find({ userId: user?.userId });
            res.status(200);
            res.json({
                result: {
                    data: availableWishlist
                }
            })
        }
    )

    private createWishList = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const user: any = req.user;
            const { productId } = req.body;
            if (!productId) {
                res.status(400);
                throw new Error('Product Id required');
            }
            
        }
    )

}
