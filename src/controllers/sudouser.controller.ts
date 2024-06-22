import logger from "../utils/logger";
import { CreateSudoUserDto } from "../types";
import {Request ,Response} from "express-serve-static-core";
import expressAsyncHandler = require("express-async-handler");

export const getAllSudoUsers = expressAsyncHandler(
  async (req: Request, res: Response) => {
    logger.info("Get all sudo users has called");
    return;
  }
);

export const getSudoUserById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    logger.info("Get sudo user by Id  has called");
    return;
  }
);

export const createSudoUser = expressAsyncHandler(
  async (req: Request<{}, {}, CreateSudoUserDto>, res: Response) => {
    const { name, email, password, phone_number, role, capbilities } = req.body;
     logger.info(name , email ,password);
     
  }
);

export const updateSudoUserById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    logger.info("update sudo user of id" + req.params.id);
  }
);

export const deleteSudoUserById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    logger.info("delete sudo user by ID");
  }
);
