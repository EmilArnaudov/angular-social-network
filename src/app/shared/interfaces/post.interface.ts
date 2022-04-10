import { IComment } from './comment.interface'

export interface Post {
    _id?: string;
    creator: string;
    creatorProfileImageUrl: string;
    imageUrl: string;
    createdAt: string;
    likes: string[];
    comments: IComment[];
    description: string;
} 