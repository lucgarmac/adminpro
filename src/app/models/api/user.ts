export interface UserRequest {
    name: string;
    email: string;
    password?: string;
    role?: string;
}

export interface UserResponse {
    user: User;
    token: string;
}

export interface UserUpdatedResponse {
    userUpdated: User;
}

export interface User {
    uid: string;
    name: string;
    email?: string;
    role?: string;
    google?: boolean;
    img?: string;
}

export interface UserSearchRequest {
    offset: number,
    limit: number,
    [filter: string]: any
}

export interface UserSearchResponse {
    totalItems: number,
    users: User[]
}

export interface UserRef extends User {
    _id?: string;
}