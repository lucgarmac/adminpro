export interface UserRequest {
    name: string;
    password: string;
    email: string;
}

export interface UserCreatedResponse {
    user: User;
    token: string;
}

export interface User {
    uid: string;
    name: string;
    email?: string;
    role?: string;
    google?: boolean;
    img?: string;
}
