// plugins/blog/plugin.ts
import BlogListPage from "./app/blog/page";
import BlogViewPage from "./app/blog/[slug]/page";
import AdminBlogPage from "./app/admin/blog/page";
import CreateBlogPage from "./app/admin/blog/create/page";
import EditBlogPage from "./app/admin/blog/edit/[id]/page";

export const blogPlugin = {
  name: "blog",
  routes: {
    "/blog": BlogListPage,
    "/blog/[slug]": BlogViewPage,
    "/admin/blog": AdminBlogPage,
    "/admin/blog/create": CreateBlogPage,
    "/admin/blog/edit/[id]": EditBlogPage,
  },
};

export default blogPlugin;
