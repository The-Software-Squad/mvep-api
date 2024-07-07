import mongoose from "mongoose";
import { ROLE_CAPACITIES } from "../../constants/capabilities";
import bcrypt from "bcrypt";
import { ISudoUser } from "./sudouser-interface";

const sudoUserSchema = new mongoose.Schema<ISudoUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      enum: [
        ROLE_CAPACITIES.super_admin,
        ROLE_CAPACITIES.admin,
        ROLE_CAPACITIES.creator,
        ROLE_CAPACITIES.noob,
      ],
      required: true,
      default: 4,
    },
    capabilities: {
      type: [String],
      required: true,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "sudouser",
    },
  },
  { timestamps: true }
);

sudoUserSchema.index({ role: 1 });

sudoUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

sudoUserSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Partial<ISudoUser> 
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

sudoUserSchema.methods.checkPassword = async function ( password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const SudoUser = mongoose.model<ISudoUser>("sudouser", sudoUserSchema);
export default SudoUser;
