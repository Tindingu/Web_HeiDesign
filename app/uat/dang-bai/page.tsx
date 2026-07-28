import { UatPostImporter } from "@/components/uat/uat-post-importer";
import {
  UAT_DEFAULT_SOURCE_SLUG,
  readUatPosts,
  readUatSourcePost,
} from "@/lib/uat-post-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function UatPostImportPage() {
  const [sourcePost, posts] = await Promise.all([
    readUatSourcePost(UAT_DEFAULT_SOURCE_SLUG),
    readUatPosts(),
  ]);

  return <UatPostImporter sourcePost={sourcePost} initialPosts={posts} />;
}
