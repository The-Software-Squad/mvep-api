import {
  CreateSudoUserDto,
  LoginSudoUserDto,
  UpdateSudoUserDto,
} from "../types";
import { Request, Response } from "express-serve-static-core";
import expressAsyncHandler = require("express-async-handler");
import SudoUser, { ISudoUser } from "../models/sudouser-model";
import generateJwtToken from "../utils/generateToken";
import getDefaultCapabilitiesByRole from "../utils/getCapabilitiesByRole";
import logger from "../utils/logger";

/**
 * login sudo user controller method will be able to set token to in cookies if user hit , Route : POST  /api/sudo-user/login  , access_level : public
 *
 * @param {Request} req Express request Object
 * @param {Response} res Express Response Object
 */
export const login = expressAsyncHandler(
  async (req: Request<{}, {}, LoginSudoUserDto>, res: Response) => {
    const { email, password } = req.body;
    if (!email && !password) {
      res.status(400);
      throw new Error("Incorrect Data format");
    }
    const foundSudoUser = await SudoUser.findOne({ email: email });
    if (!foundSudoUser) {
      res.status(400);
      throw new Error("No Account existing with given Email Id");
    }
    if (!(await foundSudoUser.checkPassword(password))) {
      res.status(400);
      throw new Error("Invalid Password");
    }
    generateJwtToken(res, foundSudoUser);
    res.status(200);
    res.json({ data :{
      email: foundSudoUser.email,
      state: "Logged in",
    }});
    return;
  }
);

/**
 * Read All Sudo User based on sudo users role , route :  GET /api/sudo-user/ access_level : private
 *
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 */
export const getAllSudoUsers = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const loggedInSudoUsersCreations = await SudoUser.find({createdBy:req.loggedInSudoUserId});
    let sudousers: ISudoUser[] = [];
    // if (loggedInUser?.role === 1) {
    //   sudousers = await SudoUser.find({}).sort({ role: 1 }).select("-password");
    //   res.json({
    //     sudousers: sudousers,
    //   });
    //   return;
    // } else if (loggedInUser?.role === 2) {
    //   sudousers = await SudoUser.find({ role: { $nin: [1] } })
    //     .sort({ role: 1 })
    //     .select("-password");
    // } else if (loggedInUser?.role === 3) {
    //   sudousers = await SudoUser.find({ role: { $in: [3, 4] } })
    //     .sort({ role: 1 })
    //     .select("-password");
    // } else if (loggedInUser?.role === 4) {
    //   sudousers = await SudoUser.find({ role: 4 })
    //     .sort({ role: 1 })
    //     .select("-password");
    // } else {
    //   res.status(400);
    //   throw new Error("Invalid User Role");
    // }

    res.status(200);
    res.json({
      data: loggedInSudoUsersCreations,
    });
    return;
  }
);

/**
 * get sudo_user by id if and only if logged in sudo_user has read access to the sudo_user he want to read , Route : GET /api/sudo-user/:{id} , path_paramenter : id ,access_level :  private
 *
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 */
export const getSudoUserById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const sudoUserId = req.params.id;
    const sudoUserWithRequestedId =
      await SudoUser.findById(sudoUserId).select("-password");
    if (!sudoUserWithRequestedId) {
      res.status(400);
      throw new Error("User Not Found With That Request ID");
    }
    res.status(200);
    res.json({ data: sudoUserWithRequestedId });
    return;
  }
);

/**
 * This controller method is used to create a sudo_user by an other sudo_user who have an valid role ,  Route :  POST  /api/sudo-user/:id  , access_level : private
 *
 * @param {Request} req  Express Request Object
 * @param {Response} res Express Response Object
 */
export const createSudoUser = expressAsyncHandler(
  async (req: Request<{}, {}, CreateSudoUserDto>, res: Response) => {
    const { name, email, password, phone_number, role, capabilities } =
      req.body;
    const foundSudoUser = await SudoUser.findOne({ email: email });
    if (foundSudoUser) {
      res.status(400);
      logger.error("User Already Error");
      throw new Error("User Already Exists");
    }
    const defaultCapabilites = getDefaultCapabilitiesByRole(role);
    const createdSudoUser = await SudoUser.create({
      name: name,
      email: email,
      password: password,
      phone_number: phone_number,
      role: role,
      capabilities: defaultCapabilites,
      createdBy: req.loggedInSudoUserId,
    });

    res.status(200);
    res.json({ data : {
      name: createdSudoUser.name,
      email: createdSudoUser.email,
    }});
    return;
  }
);

/**
 * update sudo_user by _id property of sudo_user and to delete a sudo_user , logged in sudo_user should be of appropriate role , route : PUT /api/sudo-user/:id , access_level : private
 *
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 */
export const updateSudoUserById = expressAsyncHandler(
  async (
    req: Request<{ id: string }, {}, UpdateSudoUserDto>,
    res: Response
  ) => {
    const sudoUserIdTobeUpdated = req.params.id;
    if (!sudoUserIdTobeUpdated) {
      res.status(400);
      throw new Error("No SudoUser Id was mentioned");
    }
    const { name, email, phone_number, role, capabilities } = req.body;
    const updatedSudodUser = await SudoUser.findByIdAndUpdate(
      sudoUserIdTobeUpdated,
      {
        name: name,
        email: email,
        phone_number: phone_number,
        role: role,
        capabilities: capabilities,
      }
    );
    if (!updatedSudodUser) {
      res.status(400);
      throw new Error("Sudo user failed");
    }
    res.status(200);
    res.json({
      data: {
        name: name,
        email: email,
        phone_number: phone_number,
        role: role,
        capabilities: capabilities,
      },
    });
    return;
  }
);

/**
 * delete sudo_user by _id property of sudo_user and to delete a sudo_user , logged in sudo_user should be of appropriate role , route : DELETE /api/sudousers/:id , access_level : private
 *
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 */
export const deleteSudoUserById = expressAsyncHandler(
  async (req: Request<{ id: string }, {}, {}>, res: Response) => {
    const sudoUserIdToBeDeleted = req.params.id;
    if (!sudoUserIdToBeDeleted) {
      res.status(400);
      throw new Error("No SudoUser Id was mentioned");
    }

    const deletedSudoUser = await SudoUser.findByIdAndDelete(
      sudoUserIdToBeDeleted
    ).select("-password");
    if (!deletedSudoUser) {
      res.status(400);
      throw new Error("Deletion Failed");
    }
    res.status(200);
    res.json({
      data: {
        deletedSudoUser,
      },
    });
  }
);

export const logoutSudoUser = expressAsyncHandler(async (_, res: Response) => {
  res
    .clearCookie("sudo_user_auth_jwt", {
      httpOnly: true,
      sameSite: "strict",
    })
    .status(200)
    .send({ message: "Logout Successfull" });
});
