import mongoose from "mongoose"
import { IUser } from "./user-interface";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    cart: {
        type: [{}],
        default: []
    },
    wishlist: {
        type: [{}],
        default: []
    },
    addresses: {
        type: [{}],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'users' });


userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.checkPassword = async function (password: string) {
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;
