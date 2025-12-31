import prisma from "@/lib/prisma";

export const BlogService = {
  getPublicPosts() {
    return prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  },

  getBySlug(slug: string) {
    return prisma.blogPost.findUnique({
      where: { slug },
    });
  },

  getById(id: number) {
    return prisma.blogPost.findUnique({
      where: { id },
    });
  },

  getAll() {
    return prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  create(data: {
    title: string;
    slug: string;
    content: string;
    published?: boolean;
  }) {
    return prisma.blogPost.create({ data });
  },

  update(id: number, data: any) {
    return prisma.blogPost.update({
      where: { id },
      data,
    });
  },

  delete(id: number) {
    return prisma.blogPost.delete({
      where: { id },
    });
  },
};
