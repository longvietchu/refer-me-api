import { Role } from "../models/User";

export interface IUser {
    name: String,
    email: String,
    password: String,
    role: Role,
}