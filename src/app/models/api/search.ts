import { Doctor } from "./doctor";
import { EntityNameEnum } from "./entity-name-enum";
import { Hospital } from "./hospital";
import { User } from "./user";


export interface SearchEntityRequest {
    entity?: EntityNameEnum;
    name?: string;
}

export interface DataEntityResponse {
    users?: User[];
    hospitals?: Hospital[];
    doctors?: Doctor[];
}