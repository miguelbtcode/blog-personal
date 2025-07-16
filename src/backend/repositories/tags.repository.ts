import { BaseRepository } from "./base.repository";

export class TagsRepository extends BaseRepository {
  async findMany() {
    return this.db.tag.findMany({
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
    return this.db.tag.findUnique({ where: { id } });
  }

  async findBySlug(slug: string) {
    return this.db.tag.findUnique({ where: { slug } });
  }

  async create(data: any) {
    return this.db.tag.create({ data });
  }

  async update(id: string, data: any) {
    return this.db.tag.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.db.tag.delete({ where: { id } });
  }
}
