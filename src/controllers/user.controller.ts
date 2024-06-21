import { Request, Response } from 'express'
import User from '../models/user.model'

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

    } catch (err) {
        return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
    }
}
//create user
export const createUser = async (req: Request, res: Response) => {
    try {

    } catch (err) {
        return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
    }
}
//update user
export const updateUser = async (req: Request, res: Response) => {
    try {

    } catch (err) {
        return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
    }
}
//delete user 
export const deleteUser = async (req: Request, res: Response) => {
    try {

    } catch (err) {
        return res.status(500).send({ error: 'Internal Server Error', errorMsg: err })
    }
}
//login user
export const loginUser = async (req: Request, res: Response) => {
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