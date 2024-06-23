import { Request, Response } from 'express'
import User from '../models/user-model'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

/**
 * Fetches all users from the database and returns them in the response.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * 
 * @returns {Promise<void>} Returns a promise that resolves to void.
 */

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        await User.find()
            .then((data) => {
                return res.status(200).send({ users: data })
            })
            .catch((err) => {
                return res.status(400).send({ error: 'Internal Server Error', errorMsg: err })
            })
    } catch (err) {
        return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
    }
}

/**
 * Get user by ID.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - Returns a response with the user data or an error message.
 *
 * @throws {Error} - Throws an error if an unexpected error occurs.
 */

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userID = req.params?.id;
        if (!userID) {
            return res.status(400).send({ 'error': 'Please Provide ID' })
        }
        const fetchedUser = await User.findById(userID);
        if (!fetchedUser) {
            return res.status(404).send({ error: 'User Not Found' })
        }
        return res.status(200).send({ 'user': fetchedUser })
    } catch (err) {
        return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
    }
}

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

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phoneNumber, cart, wishlist, addresses } = req.body;
        const isExists = await User.findOne({ email: email });
        if (isExists) {
            return res.status(402).send({ 'message': 'User Already Exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            cart: cart,
            wishlist: wishlist,
            addresses: addresses,
        })
        await newUser.save().then((data) => {
            return res.status(201).send({ 'message': 'User Created Successfull' })
        })
            .catch((err) => {
                return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
            })
    } catch (err) {
        return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
    }
}

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

export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = req?.params?.id;
        const { name, email, phoneNumber, cart, wishlist, addresses } = req.body;
        const validUser = await User.findById(userId);
        if (!validUser) {
            return res.status(404).send({ 'message': 'No User Found' });
        }
        const updatedCart = cart ? [...validUser.cart, ...cart] : validUser.cart;
        const updatedWishlist = wishlist ? [...validUser.wishlist, ...wishlist] : validUser.wishlist;
        const updatedAddresses = addresses ? [...validUser.addresses, ...addresses] : validUser.addresses;
        await User.findByIdAndUpdate(userId, {
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            cart: updatedCart,
            wishlist: updatedWishlist,
            addresses: updatedAddresses
        }, { new: true })
            .then((data) => {
                return res.status(200).send({ 'message': 'Updated Successfull' })
            })
            .catch((err) => {
                return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
            })

    } catch (err) {
        return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
    }
}

/**
 * Delete user by ID.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - Returns a response indicating the result of the delete operation.
 *
 * @throws {Error} - Throws an error if an unexpected error occurs.
 */

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req?.params?.id;
        const validUser = await User.findById(userId);
        if (!validUser) {
            return res.status(404).send({ 'message': 'No User Found' });
        }
        await validUser?.deleteOne();
        return res.status(200).send({ 'message': 'Deleted Successfull' });
    } catch (err) {
        return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
    }
}

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

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const validUser = await User.findOne({ email: email });
        if (!validUser) {
            return res.status(404).send({ 'message': 'No User Found' });
        }
        const isPasswordValid = await bcrypt.compare(password, validUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        //@ts-ignore
        const token = jwt.sign({ id: validUser?._id, email: validUser?.email }, process.env.JWT_SECRET, { expiresIn: '1d' })
        return res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        }).status(200).send({ "message": "Login Successfull" });
    } catch (err) {
        return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
    }
}

/**
 * Logout User.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - Returns a response indicating the result of the logout operation.
 *
 * @throws {Error} - Throws an error if an unexpected error occurs.
 */

export const logoutUser = async (req: Request, res: Response) => {
    try {
        return res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict'
        }).status(200).send({ 'message': 'Logout Successfull' })
    } catch (err) {
        return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
    }
}

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

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const validUser = await User.findOne({ email: email });
        if (!validUser) {
            return res.status(404).send({ 'message': 'No User Found' });
        }
        //@ts-ignore
        const token = jwt.sign({ userId: validUser._id, email: validUser.email }, process.env.JWT_SECRET, { expiresIn: '10min' })

        console.log(token)

        //sending the link to email
        return res.status(200).send({ 'message': 'Password Reset Link Sent Successfull' });

    } catch (err) {
        return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
    }
}

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

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        //@ts-ignore
        const { email } = req.user;

        if (!email) {
            return res.status(404).send({ 'message': 'Email Required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        ).then((data) => {
            return res.status(200).send('Password Reset Successfull');
        })
            .catch(err => {
                console.log(err);
                return res.status(500).send({ error: err })
            })

    }
    catch (err) {
        return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
    }
}