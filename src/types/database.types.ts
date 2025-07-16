import type {
  User,
  Post,
  Category,
  Tag,
  Comment,
  PostStatus,
  CommentStatus,
  Role,
  PostCategory,
  PostTag,
} from "@prisma/client";

// Re-export Prisma types
export type {
  User,
  Post,
  Category,
  Tag,
  Comment,
  PostStatus,
  CommentStatus,
  Role,
  PostCategory,
  PostTag,
};

// Extended types
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
  _count?: {
    comments: number;
    views: number;
  };
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
  replies?: Comment[];
};

export type CommentWithReplies = Comment & {
  author: User | null;
  replies: CommentWithAuthor[];
};
