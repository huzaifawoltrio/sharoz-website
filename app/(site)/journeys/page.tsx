import { getPosts } from "@/lib/data/posts";
import { getCategories } from "@/lib/data/site";
import PostList from "@/components/site/PostList";

export const dynamic = "force-dynamic";

export default async function JourneysPage({
  searchParams,
}: PageProps<"/journeys">) {
  const { category } = await searchParams;
  const categorySlug = typeof category === "string" ? category : undefined;

  const [posts, categories] = await Promise.all([
    getPosts({ type: "journey", categorySlug }),
    getCategories("journey"),
  ]);

  return (
    <PostList
      heading="Journeys"
      posts={posts}
      categories={categories}
      basePath="/journeys"
      activeCategorySlug={categorySlug}
    />
  );
}
