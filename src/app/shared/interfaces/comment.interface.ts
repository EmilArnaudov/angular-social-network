export interface Comment {
    owner: string;
    createdAt: string;
    profilePic: string;
    content: string;
    likes: [];
    replies: [];
    createdAtReadable?: string;
}