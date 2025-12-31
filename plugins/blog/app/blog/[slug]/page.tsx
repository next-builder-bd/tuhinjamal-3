import { BlogService } from "../../../services/blog.service";

import type { PluginPageProps } from "@/plugins/types";
import { notFound } from "next/navigation";
export default async function BlogViewPage({ params }: PluginPageProps) {

  const slug = params.slug;

  if (!slug) notFound();
  const post = await BlogService.getBySlug(params.slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article style={{ padding: 24 }}>
      <h1>{post.title}</h1>
      <hr />
      <div>{post.content}</div>
    </article>
  );
}
