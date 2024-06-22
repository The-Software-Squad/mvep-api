import { Request, Response } from 'express'
import User from '../models/user.model'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

//fetching all users
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
//fetching user by id
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
//create user
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
//update user
export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = req?.params?.id;
        const { name, email, phoneNumber, cart, wishlist, addresses } = req.body;
        const validUser = await User.findById(userId);
        if (!validUser) {
            return res.status(404).send({ 'message': 'No User Found' });
        }
        await User.findByIdAndUpdate(userId, {
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            cart: cart,
            wishlist: wishlist,
            addresses: addresses
        })
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
//delete user 
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
//login user
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
//logout user
export const logoutUser = async (req: Request, res: Response) => {
    try {

    } catch (err) {
        return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
    }
}

//forgot password
export const forgotPassword = async (req: Request, res: Response) => {
    try {

    } catch (err) {
        return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
    }
}