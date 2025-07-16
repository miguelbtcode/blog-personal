import { UserRole, PostStatus, CommentStatus } from "@/shared/enums";
import { QueryParams } from "./api.types";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  status: PostStatus;
  published: boolean;
  publishedAt: string | null;
  viewCount: number;
  readTime: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  author: User;
  categories: Category[];
  tags: Tag[];
  comments?: Comment[];
  commentCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  postCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  status: CommentStatus;
  postId: string;
  authorId: string | null;
  parentId: string | null;
  guestName: string | null;
  guestEmail: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  author?: User | null;
  post?: Post;
  parent?: Comment | null;
  replies?: Comment[];
}

// Create/Update DTOs
export interface CreatePostData {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  status?: PostStatus;
  authorId: string;
  categoryIds?: string[];
  tagIds?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdatePostData extends Partial<CreatePostData> {}

export interface CreateCategoryData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export interface CreateTagData {
  name: string;
}

export interface UpdateTagData extends Partial<CreateTagData> {}

export interface CreateCommentData {
  content: string;
  postId: string;
  authorId?: string;
  parentId?: string;
  guestName?: string;
  guestEmail?: string;
}

// Stats interfaces
export interface BlogStats {
  posts: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
  totalViews: number;
  totalComments: number;
  totalCategories: number;
  totalTags: number;
  recentPosts: Array<{
    id: string;
    title: string;
    slug: string;
    publishedAt: string;
    viewCount: number;
  }>;
}

// src/shared/types/api.types.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T>
  extends ApiResponse<{
    items: T[];
    pagination: PaginationMeta;
  }> {}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PostQueryParams extends QueryParams {
  category?: string;
  tag?: string;
  status?: PostStatus;
  authorId?: string;
}
