import { blogPosts, type BlogPost } from "./content";

export function publishedPosts(posts: BlogPost[] = blogPosts): BlogPost[] {
  return posts.filter((post) => post.status === "published")
    .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate) || a.slug.localeCompare(b.slug));
}

export function findPublishedPost(route: string): BlogPost | undefined {
  if (!route.startsWith("blog/")) return undefined;
  return publishedPosts().find((post) => post.slug === route.slice(5));
}

export function publicationLabel(date: string): string {
  return new Intl.DateTimeFormat("en", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
