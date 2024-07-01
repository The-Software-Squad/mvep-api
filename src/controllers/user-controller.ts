import expressAsyncHandler from "express-async-handler";
import { Request, Response } from 'express-serve-static-core';
import jwt from "jsonwebtoken";
import User from '../models/user-model';
import { sendForgotPasswordMail } from '../services/email-service';
import { generateUserForgotPasswordLink } from '../utils/genrateForgetPasswordLink';
import { generateUserJwtToken } from '../utils/generateToken';

/**
 * Fetches all users from the database and returns them in the response.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * 
 * @returns {Promise<void>} Returns a promise that resolves to void.
 */
export const getAllUsers = expressAsyncHandler(
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

/**
 * Get user by ID.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - Returns a response with the user data or an error message.
 *
 * @throws {Error} - Throws an error if an unexpected error occurs.
 */
export const getUserById = expressAsyncHandler(
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

/**
 * Create a new user.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {Object} req.body - The request body object.
 * @returns {Promise<void>} - Returns a response indicating the result of the operation.
 *
 * @throws {Error} - Throws an error if an unexpected error occurs.
 */
export const createUser = expressAsyncHandler(
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

/**
 * Update user by ID.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {Object} req.body - The request body object.
 * @returns {Promise<void>} - Returns a response indicating the result of the update operation.
 *
 * @throws {Error} - Throws an error if an unexpected error occurs.
 */
export const updateUser = expressAsyncHandler(
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

/**
 * Delete user by ID.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - Returns a response indicating the result of the delete operation.
 *
 * @throws {Error} - Throws an error if an unexpected error occurs.
 */
export const deleteUser = expressAsyncHandler(
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

/**
 * User Login.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {Object} req.body - The request body object.
 * @returns {Promise<void>} - Returns a response indicating the result of the login operation.
 *
 * @throws {Error} - Throws an error if an unexpected error occurs.
 */
export const loginUser = expressAsyncHandler(
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

/**
 * Logout User.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - Returns a response indicating the result of the logout operation.
 *
 * @throws {Error} - Throws an error if an unexpected error occurs.
 */
export const logoutUser = expressAsyncHandler(
    async (_, res: Response): Promise<void> => {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict'
        }).status(200).send({ result: { 'message': 'Logout Successfull' } })

    }
)

/**
 * Forgot Password.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {Object} req.body - The request body object.
 * @returns {Promise<void>} - Returns a response indicating the result of the forgot-password operation.
 *
 * @throws {Error} - Throws an error if an unexpected error occurs.
 */
export const forgotPassword = expressAsyncHandler(
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

/**
 * Reset User Password.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {Object} req.body - The request body object.
 * @returns {Promise<void>} - Returns a response indicating the result of the reseting user password operation.
 *
 * @throws {Error} - Throws an error if an unexpected error occurs.
 */
export const changePassword = expressAsyncHandler(
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
