import type { HTMLAttributes } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import GithubSlugger from "github-slugger";

export function MdxRenderer({ source }: { source: string }) {
  const slugger = new GithubSlugger();
  const components = {
    h2: (props: HTMLAttributes<HTMLHeadingElement>) => {
      const text = String(props.children ?? "");
      const id = slugger.slug(text);
      return <h2 id={id} className="text-2xl font-semibold" {...props} />;
    },
    h3: (props: HTMLAttributes<HTMLHeadingElement>) => {
      const text = String(props.children ?? "");
      const id = slugger.slug(text);
      return <h3 id={id} className="text-xl font-semibold" {...props} />;
    },
    p: (props: HTMLAttributes<HTMLParagraphElement>) => (
      <p
        className="text-base leading-relaxed text-muted-foreground"
        {...props}
      />
    ),
    ul: (props: HTMLAttributes<HTMLUListElement>) => (
      <ul
        className="list-disc space-y-2 pl-5 text-muted-foreground"
        {...props}
      />
    ),
  };

  return (
    <MDXRemote
      source={source}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      components={components}
    />
  );
}
