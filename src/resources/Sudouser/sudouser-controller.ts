import { Router } from "express";
import { Controller } from "../../utils/interfaces/controller-interface";
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express-serve-static-core";
import {
  CreateSudoUserDto,
  forgetPasswordDto,
  LoginSudoUserDto,
  ResetPasswordDto,
  UpdateSudoUserDto,
} from "../../types";
import generateJwtToken from "../../utils/sudouser-generatetoken";
import getDefaultCapabilitiesByRole from "../../utils/getCapabilitiesByRole";
import logger from "../../utils/logger";
import generateForgotPasswordLink from "../../utils/sudouser-forgetpasswordlink";
import { sendForgotPasswordMail } from "../../services/email-service";
import jwt from "jsonwebtoken";
import {
  rolecapacityidMiddleware,
  rolecapacityMiddleware,
  sudouserProtectMiddleWare,
} from "./sudouser-middleware";
import SudoUser from "./sudouser-model";

export default class SudouserController implements Controller {
  router: Router = Router();
  path: string = "sudouser";

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", sudouserProtectMiddleWare, this.getAllSudoUsers);
    this.router.post(
      "/",
      sudouserProtectMiddleWare,
      rolecapacityMiddleware,
      this.createSudoUser
    );
    this.router.post("/login", this.login);
    this.router.post("/logout", this.logout);
    this.router.post("/forget-password", this.forgetPassword);
    this.router.post("/reset-password", this.resetPassword);
    this.router.get(
      "/:id",
      sudouserProtectMiddleWare,
      rolecapacityidMiddleware,
      this.getSudoUserById
    );
    this.router.put(
      "/:id",
      sudouserProtectMiddleWare,
      rolecapacityidMiddleware,
      this.updateSudoUserById
    );
    this.router.delete(
      "/:id",
      sudouserProtectMiddleWare,
      rolecapacityidMiddleware,
      this.deleteSudoUserById
    );
  }

  private getAllSudoUsers = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const loggedInSudoUsersCreations = await SudoUser.find({
        createdBy: req.loggedInSudoUserId,
      });
      res.status(200);
      res.json({
        data: loggedInSudoUsersCreations,
      });
      return;
    }
  );

  private login = expressAsyncHandler(
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
      res.json({
        data: {
          email: foundSudoUser.email,
          state: "Logged in",
        },
      });
      return;
    }
  );

  private logout = expressAsyncHandler(async (_, res: Response) => {
    res
      .clearCookie("sudo_user_auth_jwt", {
        httpOnly: true,
        sameSite: "strict",
      })
      .status(200)
      .send({ message: "Logout Successfull" });
  });

  private forgetPassword = expressAsyncHandler(
    async (req: Request<{}, {}, forgetPasswordDto>, res: Response) => {
      const { email } = req.body;
      const validUser = await SudoUser.findOne({ email: email });
      if (!validUser) {
        res.status(400);
        throw new Error("No SudoUser Has Found");
      }
      const link = generateForgotPasswordLink(validUser);
      sendForgotPasswordMail(email, link);
      res.json({
        data: {
          status: "email sent successfully",
        },
      });
    }
  );

  private resetPassword = expressAsyncHandler(
    async (req: Request<{}, {}, ResetPasswordDto>, res: Response) => {
      const { token, password, verify_password } = req.body;
      if (!token) {
        throw new Error("token does not exist");
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
      const sudouserId = decoded.sudouser_id;
      const sudouser = await SudoUser.findByIdAndUpdate(sudouserId, {
        password: password,
      });
      res.json({
        data: {
          email: sudouser?.email,
          update: true,
        },
      });
    }
  );

  private getSudoUserById = expressAsyncHandler(
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

  private createSudoUser = expressAsyncHandler(
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
      res.json({
        data: {
          name: createdSudoUser.name,
          email: createdSudoUser.email,
        },
      });
      return;
    }
  );

  private updateSudoUserById = expressAsyncHandler(
    async (
      req: Request<{ id: string }, {}, UpdateSudoUserDto>,
      res: Response
    ) => {
      const sudoUserIdTobeUpdated = req.params.id;
      if (!sudoUserIdTobeUpdated) {
        res.status(400);
        throw new Error("No SudoUser Id was mentioned");
      }
      if (req.body.password) {
        res.status(400);
        throw new Error("Passwords cannot be updated here");
      }
      const updatedSudodUser = await SudoUser.findByIdAndUpdate(
        sudoUserIdTobeUpdated,
        req.body
      );
      if (!updatedSudodUser) {
        res.status(400);
        throw new Error("Sudo user failed");
      }
      res.status(200);
      res.json({
        data: {
          email: updatedSudodUser.email,
          update: true,
        },
      });
      return;
    }
  );

  private deleteSudoUserById = expressAsyncHandler(
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
}
