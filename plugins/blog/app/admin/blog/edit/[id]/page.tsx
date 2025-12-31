import { BlogService } from "../../../../../services/blog.service";
import { updatePost } from "../actions";
import type { PluginPageProps } from "@/plugins/types";
import { notFound } from "next/navigation";
export default async function EditBlogPage({ params }: PluginPageProps) {

  const id = Number(params.id);
  if (!id) notFound();

  if (Number.isNaN(id)) {
    return <p>Invalid post id</p>;
  }

  const post = await BlogService.getById(id);

  if (!post) {

    return <p>Post not found fdgfgd{post}</p>;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Edit Post</h1>

      <form action={updatePost}>
        <input type="hidden" name="id" value={post.id} />

        <div>
          <input
            name="title"
            defaultValue={post.title}
            placeholder="Title"
          />
        </div>

        <div>
          <textarea
            name="content"
            defaultValue={post.content}
            placeholder="Content"
          />
        </div>

        <label>
          <input
            type="checkbox"
            name="published"
            defaultChecked={post.published}
          />
          Published
        </label>

        <br />

        <button type="submit">💾 Save</button>
      </form>
    </main>
  );
}
