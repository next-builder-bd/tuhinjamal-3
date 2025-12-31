"use server";

import { BlogService } from "../../../../services/blog.service";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updatePost(formData: FormData) {
  const id = Number(formData.get("id"));

  await BlogService.update(id, {
    title: String(formData.get("title")),
    content: String(formData.get("content")),
    published: formData.get("published") === "on",
  });

  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}
