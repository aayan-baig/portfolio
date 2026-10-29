import type { BlogPost } from "../content";
import { publishedPosts, publicationLabel } from "../blog";
import { hrefFor } from "../navigation";
import { assetPath } from "../icons";
import PageHeading from "../components/PageHeading";
import Newsletter from "../components/Newsletter";

export function BlogPage() {
  const posts = publishedPosts();
  return (
    <>
      <PageHeading title="Blog" icon="text" />
      {posts.length === 0 && <p className="empty-note">No published posts.</p>}
      {posts.map((post) => (
        <article className="reading-panel" key={post.slug}>
          <h2><a href={hrefFor(`blog/${post.slug}`)}>{post.title}</a></h2>
          <time className="blog-date" dateTime={post.publicationDate}>{publicationLabel(post.publicationDate)}</time>
          {post.excerpt && <p>{post.excerpt}</p>}
          {post.tags.length > 0 && <p className="blog-tags">Tags: {post.tags.join(", ")}</p>}
        </article>
      ))}
      <Newsletter />
    </>
  );
}

export function BlogPostPage({ post }: { post: BlogPost }) {
  if (post.status !== "published") return null;
  return (
    <article>
      <PageHeading title={post.title} icon="text" />
      <div className="reading-panel">
        <time className="blog-date" dateTime={post.publicationDate}>{publicationLabel(post.publicationDate)}</time>
        {post.cover && <img className="blog-cover" src={assetPath(post.cover)} alt="" />}
        {post.content.split(/\n\s*\n/).filter((paragraph) => paragraph.trim()).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        {post.tags.length > 0 && <p className="blog-tags">Tags: {post.tags.join(", ")}</p>}
      </div>
    </article>
  );
}
