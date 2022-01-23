import { TemplateRef } from "@angular/core";
import { Hospital } from "./api/hospital";

export interface HospitalExtended extends Hospital {
    imgTemplate?: TemplateRef<any>;
}
