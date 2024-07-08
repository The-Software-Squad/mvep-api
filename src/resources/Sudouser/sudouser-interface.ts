import mongoose from "mongoose";

export interface ISudoUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  role: 1 | 2 | 3 | 4;
  capabilities: string[];
  createdBy: mongoose.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
  checkPassword: (password: string) => Promise<boolean>;
}
