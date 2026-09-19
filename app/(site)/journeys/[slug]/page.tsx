import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/data/posts";
import PostDetail from "@/components/site/PostDetail";

export const dynamic = "force-dynamic";

export default async function JourneyDetailPage({
  params,
}: PageProps<"/journeys/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug("journey", slug);
  if (!post) notFound();
  return <PostDetail post={post} />;
}
