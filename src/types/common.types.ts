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
    instagram?: string;
  };
  features: {
    comments: boolean;
    newsletter: boolean;
    search: boolean;
    analytics: boolean;
  };
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  totalComments: number;
  pendingComments: number;
  approvedComments: number;
  totalViews: number;
  categoriesCount: number;
  tagsCount: number;
  usersCount: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: "post" | "comment" | "user" | "category" | "tag";
  action: "created" | "updated" | "deleted" | "published";
  title: string;
  user: string;
  timestamp: string;
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}
