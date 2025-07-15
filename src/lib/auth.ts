import { NextAuthOptions, type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
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
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "tu@email.com",
        },
        password: {
          label: "Contraseña",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            return null;
          }

          // Aquí deberías verificar la contraseña con bcrypt
          // Por ahora, solo verificamos que exista el usuario
          // En una implementación real, compararías la contraseña hasheada

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
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
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false;
      }

      // Para proveedores OAuth, crear o actualizar el usuario
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            // Actualizar información del usuario si es necesario
            await prisma.user.update({
              where: { email: user.email },
              data: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
              },
            });
          } else {
            // Crear nuevo usuario
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                role: "USER", // Rol por defecto
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error creating/updating user:", error);
          return false;
        }
      }

      return true;
    },
  },
  events: {
    async createUser({ user }) {
      // Log cuando se crea un nuevo usuario
      console.log(`New user created: ${user.email}`);
    },
    async signIn({ user, account, isNewUser }) {
      // Log cuando un usuario inicia sesión
      console.log(`User signed in: ${user.email} via ${account?.provider}`);
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
