import mongoose from "mongoose"
import { UserAddress } from "./address-interface"

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


const Address = mongoose.model('Address', addressSchema);

export default Address;