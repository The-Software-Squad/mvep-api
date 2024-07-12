import mongoose, { CallbackError } from "mongoose"
import { UserAddress } from "./address-interface"
import User from "../User/user-model";

export const addressSchema = new mongoose.Schema<UserAddress>({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true
    },
    contact: {
        email: String,
        phone: String,
    },
    address: {
        doorNo: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        location: {
            type: {
                type: String,
                default: 'Point'
            },
            coordinates: [Number],
        }
    },
    additionalInstructions: {
        type:String
    }

}, { collection: "addresses", timestamps: true })

addressSchema.post('save', async function (doc, next) {
    try {
        await User.findByIdAndUpdate(doc.createdBy, { $push: { addresses: doc._id } });
        next();
    } catch (error) {
        next(error as CallbackError);
    }
});
const Address = mongoose.model('Address', addressSchema);

export default Address;
