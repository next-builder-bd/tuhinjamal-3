import Form from "next/form";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default function NewBlogPost() {
  async function createBlog(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;

    if (!title || !slug || !content) {
      throw new Error("All fields are required");
    }

    await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        published: true,
      },
    });

    revalidatePath("/admin/blog");
    redirect("/admin/blog");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Blog Post</h1>

      <Form action={createBlog} className="space-y-6">
        <div>
          <label htmlFor="title" className="block mb-2 font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Blog title"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block mb-2 font-medium">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            placeholder="blog-post-slug"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="content" className="block mb-2 font-medium">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={8}
            placeholder="Write your blog content..."
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Create Blog Post
        </button>
      </Form>
    </div>
  );
}
