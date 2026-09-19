import { getPosts } from "@/lib/data/posts";
import PostList from "@/components/site/PostList";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPosts({ type: "blog" });

  return (
    <PostList heading="Blog" posts={posts} categories={[]} basePath="/blog" />
  );
}
