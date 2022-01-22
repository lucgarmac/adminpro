import { TemplateRef } from "@angular/core";
import { User } from "./api/user";

export interface UserExtended extends User{
    imgTemplate?: TemplateRef<any>;
    authTemplate?: TemplateRef<any>;
    imgUrl?: string;
    actionDisabled?: boolean;
}
