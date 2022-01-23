import { HospitalRef } from "./hospital";
import { UserRef } from "./user";

export interface DoctorRequest {
    name: string;
    hospital: string;
}

export interface DoctorResponse {
    newDoctor: Doctor;
}

export interface DoctorUpdatedResponse {
    doctorUpdated: Doctor;
}

export interface DoctorSearchResponse {
    doctors: Doctor[];
}


export interface Doctor {
    uid: string;
    name: string;
    user: UserRef;
    hospital: HospitalRef;
    img?: string;
}


