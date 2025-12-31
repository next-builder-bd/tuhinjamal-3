import { BlogService } from "../../../services/blog.service";
import { deletePost } from "./actions";
import DeleteButton from "./DeleteButton";

export default async function AdminBlogPage() {
  const posts = await BlogService.getAll();

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin Blog</h1>

      <a href="/admin/blog/create">➕ Create Post</a>



      <ul style={{ marginTop: 20 }}>
        {posts.map(post => (
          <li key={post.id} style={{ marginBottom: 10 }}>
            <strong>{post.title}</strong>{" "}
            — {post.published ? "Published" : "Draft"}

            {" | "}
            {post.published && (
              <>
                {" | "}
                <a href={`/blog/${post.slug}`}>👁️ View</a>
              </>
            )}

            {" |   "}
            {/* <a href={`/admin/blog/edit/${post.id}`}>✏️ Edit</a> */}

            <a href={`/admin/blog/edit/${post.id}`}>✏️ Edit</a>


            {" | "}
            <form
              action={deletePost.bind(null, post.id)}
              style={{ display: "inline" }}
            >
              <DeleteButton />
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
