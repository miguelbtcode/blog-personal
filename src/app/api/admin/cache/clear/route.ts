import { NextRequest } from "next/server";
import { PostsController } from "@/backend/controllers/posts.controller";

const postsController = new PostsController();

export async function POST(request: NextRequest) {
  return postsController.clearCache(request);
}
