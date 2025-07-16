import type { PostStatus, CommentStatus } from "./database.types";

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: PostStatus;
  categoryIds?: string[];
  tagIds?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string;
}

export interface CreateTagData {
  name: string;
  slug: string;
}

export interface UpdateTagData extends Partial<CreateTagData> {
  id: string;
}

export interface CreateCommentData {
  content: string;
  postId: string;
  authorId?: string;
  parentId?: string;
  guestName?: string;
  guestEmail?: string;
}

export interface UpdateCommentData extends Partial<CreateCommentData> {
  id: string;
  status?: CommentStatus;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  website?: string;
  twitter?: string;
  github?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterData {
  email: string;
}

export interface UploadImageData {
  file: File;
  alt?: string;
  caption?: string;
}
