import type { PostStatus, CommentStatus } from "./database.types";
import type { QueryParams } from "./api.types";

export interface PostFilters extends QueryParams {
  status?: PostStatus;
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  featured?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: "createdAt" | "updatedAt" | "publishedAt" | "title" | "viewCount";
}

export interface CommentFilters extends QueryParams {
  postId?: string;
  status?: CommentStatus;
  authorId?: string;
  startDate?: string;
  endDate?: string;
}

export interface CategoryFilters extends QueryParams {
  sortBy?: "name" | "createdAt" | "postCount";
}

export interface TagFilters extends QueryParams {
  sortBy?: "name" | "createdAt" | "postCount";
}

export interface UserFilters extends QueryParams {
  role?: string;
  status?: "active" | "inactive";
  sortBy?: "name" | "email" | "createdAt" | "postCount";
}
