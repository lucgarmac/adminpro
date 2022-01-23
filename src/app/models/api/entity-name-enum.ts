export enum EntityNameEnum {
    Users= 'users',
    Hospitals= 'hospitals',
    Doctors= 'doctors'
}

export type EntityNameType = keyof typeof EntityNameEnum;