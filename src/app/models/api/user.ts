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
