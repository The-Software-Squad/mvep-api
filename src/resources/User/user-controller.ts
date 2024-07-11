import { Router } from "express";
import { Controller } from "../../utils/interfaces/controller-interface";
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import User from "./user-model";
import { generateUserForgotPasswordLink, generateUserJwtToken } from "./user-utils";
import { sendForgotPasswordMail } from "../../services/email-service";
import { verifyAuth } from "./user-middleware";
import { verifyPasswordReset } from "../../middleware/forgot-middleware";
import { verifySuperAdmin } from "../../middleware/permissions-middleware";

export default class UserController implements Controller {
    router: Router = Router();
    path: string = "user";

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', verifySuperAdmin,this.getAllUsers)
        this.router.get('/:id', this.getUserById)
        this.router.post('/', this.createUser)
        this.router.put('/:id', verifyAuth, this.updateUser)
        this.router.delete('/:id', verifyAuth, this.deleteUser)
        this.router.post('/login', this.loginUser)
        this.router.post('/logout', verifyAuth, this.logoutUser)
        this.router.post('/forgot-password', this.forgotPassword)
        this.router.post('/reset-password/:token', verifyPasswordReset, this.changePassword)
    }

    private getAllUsers = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const allUsers = await User.find();
            res.status(200);
            res.json({
                result: {
                    data: allUsers
                }
            })
        }
    )

    private getUserById = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const userID = req.params?.id;
            if (!userID) {
                res.status(400);
                throw new Error("User ID required");
            }
            const fetchedUser = await User.findById(userID);
            if (!fetchedUser) {
                res.status(404);
                throw new Error("No User Found");
            }
            res.status(200).send(
                {
                    results: {
                        data: fetchedUser
                    }
                }
            )
        }
    )

    private createUser = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const { name, email, password, phoneNumber, cart, wishlist, addresses } = req.body;
            const isExists = await User.findOne({ email: email });
            if (isExists) {
                res.status(402);
                throw new Error("User already exists");
            }
            const newUser = await User.create({
                name: name,
                email: email,
                password: password,
                phoneNumber: phoneNumber,
                cart: cart,
                wishlist: wishlist,
                addresses: addresses,
            })
            res.status(200);
            res.json({
                data: {
                    name: newUser.name,
                    email: newUser.email,
                },
            });
            return;
        }
    )

    private updateUser = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const userId = req?.params?.id;
            const { name, email, phoneNumber, cart, wishlist, addresses } = req.body;
            const validUser = await User.findById(userId);
            if (!validUser) {
                res.status(404)
                throw new Error("No User Found");
            }
            const updatedCart = cart ? [...validUser.cart, ...cart] : validUser.cart;
            const updatedWishlist = wishlist ? [...validUser.wishlist, ...wishlist] : validUser.wishlist;
            const updatedAddresses = addresses ? [...validUser.addresses, ...addresses] : validUser.addresses;
            const isUpdated = await User.findByIdAndUpdate(userId, {
                name: name,
                email: email,
                phoneNumber: phoneNumber,
                cart: updatedCart,
                wishlist: updatedWishlist,
                addresses: updatedAddresses
            }, { new: true })
            if (!isUpdated) {
                res.status(500);
                throw new Error("User update Failed");
            }
            res.status(200);
            res.json({
                data: {
                    email: isUpdated.email,
                    update: true,
                },
            });
            return;
        }
    )

    private deleteUser = expressAsyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const userId = req?.params?.id;
            const validUser = await User.findById(userId);
            if (!validUser) {
                res.status(404);
                throw new Error("No User Found");
            }
            const deletedUser = await validUser?.deleteOne();
            if (!deletedUser) {
                res.status(400)
                throw new Error('User Deleted Failed');
            }
            res.status(200).send({ result: { 'message': 'Deleted Successfull' } });
        }
    )

    private loginUser = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const { email, password } = req.body;
            if (!email && !password) {
                res.status(400);
                throw new Error("Incorrect Data format");
            }
            const validUser = await User.findOne({ email: email })
            if (!validUser) {
                res.status(404);
                throw new Error("User Not Found");
            }
            if (!(await validUser.checkPassword(password))) {
                res.status(400);
                throw new Error("Invalid Password");
            }
            generateUserJwtToken(res, validUser);
            res.status(200);
            res.json({
                data: {
                    email: validUser.email,
                    state: "Logged in",
                },
            });
            return;

        }
    )

    private logoutUser = expressAsyncHandler(
        async (_, res: Response): Promise<void> => {
            res.clearCookie('token', {
                httpOnly: true,
                sameSite: 'strict'
            }).status(200).send({ result: { 'message': 'Logout Successfull' } })

        }
    )

    private forgotPassword = expressAsyncHandler(
        async (req: Request, res: Response): Promise<void> => {
            const { email } = req.body;
            const validUser = await User.findOne({ email: email });
            if (!validUser) {
                res.status(404)
                throw new Error("User Not Found")
            }
            const link = generateUserForgotPasswordLink(validUser);
            sendForgotPasswordMail(validUser?.email, link);
            res.status(200).json({
                data: {
                    status: "Email sent successfully",
                },
            })
        }
    )

    private changePassword = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const { token, password, verify_password } = req.body;
            if (!token) {
                throw new Error("Token does not exist");
            }
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
            } catch (e) {
                res.status(400);
                throw new Error("Invalid token");
            }
            if (verify_password !== password) {
                res.status(400);
                throw new Error("Please re verify the password");
            }
            const userId = decoded.userId;
            const user = await User.findByIdAndUpdate(userId, {
                password: password,
            });
            res.json({
                data: {
                    email: user?.email,
                    update: true,
                },
            });
        }
    );
}
