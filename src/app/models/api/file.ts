import { Doctor } from "./doctor";
import { EntityNameEnum } from "./entity-name-enum";
import { Hospital } from "./hospital";
import { User } from "./user";

export interface FileRequest {
    entity: EntityNameEnum;
    imageName: string;
}

export interface FileUploadRequest {
    id: string;
    entity: EntityNameEnum;
    img: File;
}

export interface FileUploadUserResponse {
    user: User;
}

export interface FileUploadDoctorResponse {
    doctor: Doctor;
}

export interface FileUploadHospitalResponse {
    hospital: Hospital;
}
