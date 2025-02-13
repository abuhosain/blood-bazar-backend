import { model, Schema, Types } from "mongoose";
import { IUser, UserModel } from "./auth.interface";
import config from "../config";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, required: true },
  zila: { type: String, required: true },
  upaZila: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String, required: true },
  bio: { type: String },
  lastDonate: { type: Date },
  bloodGroup: { type: String },
  age: { type: Number, required: true },
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) {
    return next();
  }

  try {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
    next();
  } catch (error: any) {
    return next(error); // Handle errors if hashing fails
  }
});

// Method to find user by email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await this.findOne({ email }).select("+password"); // Always include password for comparison
};

// Set password to an empty string after saving for security
userSchema.post("save", function (doc, next) {
  doc.password = ""; // Clear password after saving
  next();
});

// Method to compare password during login
userSchema.statics.isUserPasswordMatch = async function (
  plainTextPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

// Export the user model
export const User = model<IUser, UserModel>("User", userSchema);
