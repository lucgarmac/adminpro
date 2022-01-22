import { EntityNameEnum } from "../api/entity-name-enum";

export interface ModalData {
    hide: boolean;
    entityDataModal?: EntityDataModal;    
}

export interface EntityDataModal {
    entity: EntityNameEnum;
    id: string;
    token: string;
    defaultImageUrl?: string;
}
