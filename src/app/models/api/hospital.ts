import { User } from "./user";

export interface Hospital {
    id: string;
    name: string;
    user?: User;
    img?: string;
}
