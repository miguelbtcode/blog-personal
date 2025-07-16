import { BaseRepository } from "./base.repository";

export class CategoriesRepository extends BaseRepository {
  async findMany() {
    return this.db.category.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  status: "PUBLISHED",
                  published: true,
                },
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string) {
    return this.db.category.findUnique({ where: { id } });
  }

  async findBySlug(slug: string) {
    return this.db.category.findUnique({ where: { slug } });
  }

  async create(data: any) {
    return this.db.category.create({ data });
  }

  async update(id: string, data: any) {
    return this.db.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.db.category.delete({ where: { id } });
  }
}
