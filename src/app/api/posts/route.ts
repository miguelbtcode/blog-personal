import { PostsController } from "@/backend/controllers/posts.controller";

const postsController = new PostsController();

export async function GET(request: Request) {
  return postsController.getPosts(request as any);
}
