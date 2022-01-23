import { TemplateRef } from "@angular/core";
import { Doctor } from "./api/doctor";

export interface DoctorExtended extends Doctor {
    imgTemplate?: TemplateRef<any>;
    hospitalName?: string;
}
