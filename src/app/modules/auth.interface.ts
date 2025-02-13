import { Model, Types } from "mongoose";
import { USER_ROLE } from "./auth.constance";
 

export interface IUser {
  _id: Types.ObjectId;
  id?: string;
  referenceId?: string;
  name: string;
  type: "donor" | "blood_bank"; 
  email: string;
  password: string;
  phone: string;
  role: "admin" | "user";  
  zila: string;
  upaZila: string;
  address: string;
  image: string;
  bio?: string;
  
  // Donor-specific fields
  lastDonate?: Date;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  age?: number;
  gender?: "male" | "female" | "other";

  // Blood Bank-specific fields
  facebook?: string;


  // Common system fields
  isDeleted: boolean;
  isBlocked: boolean;
  needsPasswordChange?: boolean;
  passwordChangedAt?: Date;
}


export interface ILoginUser {
  email: string;
  password: string;
}

export type IUserRole = keyof typeof USER_ROLE;

export type INewUser = {
  password: string;
  role: string;
  email: string;
};

export interface UserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUser>;

  isUserPasswordMatch(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}
