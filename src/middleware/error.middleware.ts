import { NextFunction, Request, Response } from "express";


export function notFound(req:Request , res:Response , next: NextFunction){
    
    const error = new Error("not Found - " + req.originalUrl);
    res.status(404);
    next(error);
};

export function errorMiddleWare(err : any, req:Request, res:Response, next:NextFunction){
    let statusCode = res.statusCode ===200 ? 500 : res.statusCode;
    
    let message = err.message;
        
    if (err.name === "CastError" && err.kind === "ObjectId") {
        statusCode = 404;
        message = "not found";
      }
    
      res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });

};