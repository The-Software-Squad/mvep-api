import * as express from "express-serve-static-core";

declare global {
    namespace Express {
        interface Request {
            loggedInSudoUserId: string | " ",
            user: string | " ",
        }
    }
}

// DTO'S :  Data Transfer Objects 
export interface CreateSudoUserDto {
    name: string;
    email: string;
    password: string;
    phone_number: string;
    role: 1 | 2 | 3 | 4;
    capabilities: string[];
}

export interface UpdateSudoUserDto {
    name: string;
    email: string;
    password: string;
    phone_number: string;
    role: 1 | 2 | 3 | 4;
    capabilities: string[];
}


export interface LoginSudoUserDto {
    email: string;
    password: string;
}

export interface forgetPasswordDto {
    email: string;
}

export interface ResetPasswordDto {
    token: string;
    password: string;
    verify_password: string;
}
//Param Types

export interface SudoUserParam {
    id: string
};
