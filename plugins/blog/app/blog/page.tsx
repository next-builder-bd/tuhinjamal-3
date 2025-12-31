import { BlogService } from "../../services/blog.service";

export default async function BlogListPage() {
  const posts = await BlogService.getPublicPosts();

  return (
    <main style={{ padding: 24 }}>
      <h1>Blog</h1>

      {posts.length === 0 && <p>No posts yet.</p>}

      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <a href={`/blog/${post.slug}`}>
              {post.title}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
