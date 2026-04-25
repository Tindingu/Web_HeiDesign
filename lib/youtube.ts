export function extractYouTubeId(url: string): string | null {
  if (!url?.trim()) return null;

  const value = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

  try {
    const parsed = new URL(value);
    const host = parsed.hostname.replace(/^(www\.|m\.)/, "");

    if (host === "youtu.be") {
      const videoId = parsed.pathname.split("/").filter(Boolean)[0];
      return videoId || null;
    }

    if (host === "youtube.com") {
      const watchId = parsed.searchParams.get("v");
      if (watchId) return watchId;

      const match = parsed.pathname.match(
        /\/(embed|shorts|v)\/([a-zA-Z0-9_-]{11})/,
      );
      if (match) return match[2];
    }
  } catch {
    // Fall through to regex parsing below.
  }

  const fallback = value.match(
    /(?:v=|\/embed\/|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return fallback?.[1] ?? null;
}

export function buildYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
}

export function buildYouTubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
