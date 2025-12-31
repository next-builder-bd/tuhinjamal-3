"use server";

import { BlogService } from "../../../services/blog.service";
import { revalidatePath } from "next/cache";

export async function deletePost(id: number) {
  await BlogService.delete(id);

  // refresh admin list
  revalidatePath("/admin/blog");
}
