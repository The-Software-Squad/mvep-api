import { ISudoUser } from "../models/sudouser-model";
import jwt from "jsonwebtoken";
export default function generateForgotPasswordLink(sudouser:ISudoUser):string{
    const token = jwt.sign({sudoUserId:sudouser._id} , process.env.JWT_SECRET!  , {expiresIn :"10m"} )
    const link = `http://localhost:3000/reset-password/${sudouser._id}/${token}`;
    return link
}