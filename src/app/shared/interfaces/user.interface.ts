export interface User {
    email: string;
    username: string;
    password: string;
    repeatPassword: string;
}

export interface UserProfile {
    email: string;
    followers: string[];
    following: string[];
    likesOnOwnPosts: string[];
    posts: string[];
    profileDescription: string;
    profilePicture: string;
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
    country: string;
    region: string;
    phoneNumber: string;
    postsCount: number;
}