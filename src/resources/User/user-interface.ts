import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    cart: [],
    wishlist: [mongoose.Schema.Types.ObjectId],
    addresses: [],
    updatedAt: Date;
    createdAt: Date;
    checkPassword: (password: string) => Promise<boolean>;
}
