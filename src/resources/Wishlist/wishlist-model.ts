import mongoose from "mongoose"
import { IWishList } from "./wishlist-interface"

const wishListSchema = new mongoose.Schema<IWishList>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    items:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Product',
        required:true
    }

},{collection:'wishlist',timestamps:true})

const WishList = mongoose.model('WishList',wishListSchema);
export default WishList