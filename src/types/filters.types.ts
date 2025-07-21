import { CommentStatus, PostStatus } from "@prisma/client";
import type { QueryParams } from "./api.types";

export interface PostFilters extends QueryParams {
  category?: string;
  tag?: string;
  status?: PostStatus;
  isAdmin?: boolean;
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
