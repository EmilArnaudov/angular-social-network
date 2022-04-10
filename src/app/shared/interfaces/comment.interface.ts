export interface IComment {
    owner: string;
    createdAt: string;
    profilePic: string;
    content: string;
    likes: [];
    replies: [];
    createdAtReadable?: string;
}