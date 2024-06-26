import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

/** when API got hit with unknown Request URL This not Found Middleware will come in action
 *
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {NextFunction} next Express Next Function
 */
export function notFound(req: Request, res: Response, next: NextFunction) {
  const error = new Error("not Found - " + req.originalUrl);
  res.status(404);
  next(error);
}

/**
 * This is the Error Middleware that will be going to override the  default middleware
 *
 * @param {ErrorRequestHandler} err Express Error Request Handler
 * @param {Request} req Express Request Handler
 * @param {Response} res Express Response Handler
 * @param {NextFunction} next Express Next Function
 */
export function errorMiddleWare(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message;
  logger.info("Caught By Middle Ware");

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "not found";
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
}
