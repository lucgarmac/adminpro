import { Hospital } from "./hospital";
import { User } from "./user";

export interface Doctor {
    uid: string;
    name: string;
    user: User;
    hospital: Hospital;
}
