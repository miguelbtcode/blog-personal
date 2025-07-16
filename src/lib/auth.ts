import { NextAuthOptions, type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";

// Extender los tipos de NextAuth para incluir el rol del usuario
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin",
    error: "/admin?error=CredentialsSignin",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@example.com",
        },
        password: {
          label: "Contraseña",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos");
        }

        try {
          // Buscar usuario por email
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.password) {
            throw new Error("Credenciales inválidas");
          }

          // Verificar contraseña
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Credenciales inválidas");
          }

          // Verificar que sea admin (opcional - se puede quitar si quieres que otros roles accedan)
          if (user.role !== "ADMIN") {
            throw new Error("No tienes permisos de administrador");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("Error durante autenticación:", error);
          throw new Error("Error de autenticación");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log(`Admin signed in: ${user.email} via ${account?.provider}`);
    },
  },
};

// Utilidades para verificar roles y permisos
export function isAdmin(user: { role: Role } | null): boolean {
  return user?.role === "ADMIN";
}

export function isEditor(user: { role: Role } | null): boolean {
  return user?.role === "EDITOR" || user?.role === "ADMIN";
}

export function canCreatePosts(user: { role: Role } | null): boolean {
  return isEditor(user);
}

export function canManageUsers(user: { role: Role } | null): boolean {
  return isAdmin(user);
}

export function canModerateComments(user: { role: Role } | null): boolean {
  return isEditor(user);
}

export function canManageCategories(user: { role: Role } | null): boolean {
  return isEditor(user);
}

export function canEditPost(
  user: { role: Role; id: string } | null,
  authorId: string
): boolean {
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (isEditor(user) && user.id === authorId) return true;
  return false;
}

export function canDeletePost(
  user: { role: Role; id: string } | null,
  authorId: string
): boolean {
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (user.role === "EDITOR" && user.id === authorId) return true;
  return false;
}
