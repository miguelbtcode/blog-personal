import {
  type User,
  type Post,
  type Category,
  type Tag,
  type Comment,
} from "@prisma/client";

// Tipos base extendidos
export type UserWithPosts = User & {
  posts: Post[];
};

export type PostWithDetails = Post & {
  author: User;
  categories: (PostCategory & {
    category: Category;
  })[];
  tags: (PostTag & {
    tag: Tag;
  })[];
  comments: Comment[];
};

export type PostWithAuthor = Post & {
  author: User;
};

export type PostWithCategories = Post & {
  categories: (PostCategory & {
    category: Category;
  })[];
};

export type PostWithTags = Post & {
  tags: (PostTag & {
    tag: Tag;
  })[];
};

export type CategoryWithPosts = Category & {
  posts: (PostCategory & {
    post: Post;
  })[];
  _count: {
    posts: number;
  };
};

export type TagWithPosts = Tag & {
  posts: (PostTag & {
    post: Post;
  })[];
  _count: {
    posts: number;
  };
};

export type CommentWithAuthor = Comment & {
  author: User | null;
  replies: Comment[];
};

export type CommentWithReplies = Comment & {
  author: User | null;
  replies: CommentWithAuthor[];
};

// Tipos para formularios
export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: "DRAFT" | "PUBLISHED";
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

export interface CreateTagData {
  name: string;
  slug: string;
}

export interface CreateCommentData {
  content: string;
  postId: string;
  authorId?: string;
  parentId?: string;
  guestName?: string;
  guestEmail?: string;
}

// Tipos para API responses
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Tipos para filtros y búsqueda
export interface PostFilters {
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "publishedAt" | "title" | "viewCount";
  sortOrder?: "asc" | "desc";
}

export interface CommentFilters {
  postId?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "SPAM";
  page?: number;
  limit?: number;
}

// Tipos para SEO
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

// Tipos para navegación
export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  disabled?: boolean;
  external?: boolean;
}

export interface MenuItem extends NavItem {
  children?: MenuItem[];
}

// Tipos para dashboard
export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalComments: number;
  pendingComments: number;
  totalViews: number;
  categoriesCount: number;
  tagsCount: number;
}

// Tipos para configuración
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  author: {
    name: string;
    email: string;
    twitter?: string;
    github?: string;
  };
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

// Tipos para formularios de contacto
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Tipos para newsletter
export interface NewsletterData {
  email: string;
}

// Re-exportar tipos de Prisma
export type {
  User,
  Post,
  Category,
  Tag,
  Comment,
  PostStatus,
  CommentStatus,
  Role,
} from "@prisma/client";

// Tipos para relaciones intermedias
export interface PostCategory {
  postId: string;
  categoryId: string;
}

export interface PostTag {
  postId: string;
  tagId: string;
}
