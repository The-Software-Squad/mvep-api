import mongoose from "mongoose";

export interface IWishList extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId,
    items: [mongoose.Schema.Types.ObjectId]
}
