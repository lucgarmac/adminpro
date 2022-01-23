import {  UserRef } from "./user";

export interface HospitalRequest {
    name: string;
}

export interface HospitalResponse {
    newHospital: Hospital;
}

export interface HospitalUpdatedResponse {
    hospitalUpdated: Hospital;
}

export interface HospitalSearchResponse {
    hospitals: Hospital[];
}

export interface Hospital {
    id: string;
    name: string;
    user?: UserRef;
    img?: string;
}

export interface HospitalRef extends Hospital {
    _id: string;
}


