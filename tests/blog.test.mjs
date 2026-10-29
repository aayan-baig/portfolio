import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename } from "node:path";
import { build } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { blogPost, blogPosts } from "../src/content.ts";
import { publishedPosts, findPublishedPost } from "../src/blog.ts";
import { hrefFor, parentRoute, routeTitle, routeFromHash } from "../src/navigation.ts";
import { BlogPage, BlogPostPage } from "../src/pages/BlogPage.tsx";
import { publicBlogSource, publicBlogContent } from "../build/public-blog.ts";

const published = (slug, date = "2026-10-28") => blogPost(slug, "[Test title]", {
  status: "published", publicationDate: date, content: "[Test article]\n\n[Second paragraph]",
});
const render = (Component, props = {}) => renderToStaticMarkup(React.createElement(Component, props));

test("blog helper defaults to draft and validates published entries", () => {
  assert.equal(blogPost("test-draft", "[Draft title]").status, "draft");
  assert.throws(() => blogPost("Invalid Slug", "[Title]"), /slugs/);
  assert.throws(() => blogPost("test", "[Title]", { status: "published" }), /require/);
  assert.throws(() => published("test", "2026-02-30"), /valid/);
  assert.throws(() => published("test", "invalid-date"), /valid/);
});

test("published directory excludes drafts and sorts dates newest first", () => {
  const posts = [published("older", "2025-01-01"), blogPost("private-draft", "[Private]"), published("newer")];
  assert.deepEqual(publishedPosts(posts).map((post) => post.slug), ["newer", "older"]);
  assert.equal(posts.length, 3);
});

test("published post URLs, titles, and Back destinations resolve; drafts stay inaccessible", () => {
  try {
    blogPosts.push(published("test-post"), blogPost("private-draft", "[Private draft]"));
    assert.equal(hrefFor("blog/test-post"), "#blog/test-post");
    assert.equal(routeFromHash("#blog/test-post"), "blog/test-post");
    assert.equal(routeTitle("blog/test-post"), "[Test title]");
    assert.equal(parentRoute("blog/test-post"), "blog");
    assert.equal(parentRoute("blog"), "home");
    assert.equal(findPublishedPost("blog/private-draft"), undefined);
    assert.equal(routeTitle("blog/private-draft"), "Page not found");
    assert.equal(findPublishedPost("blog/missing"), undefined);
  } finally {
    blogPosts.length = 0;
  }
});

test("empty Blog and Newsletter are honest empty states without a subscription form", () => {
  const html = render(BlogPage);
  assert(html.includes("No published posts."));
  assert(html.includes("Newsletter"));
  assert(html.includes("Subscriptions are not available."));
  assert(!/<form|<input|<button/.test(html));
});

test("published posts render their metadata and plain-text article without exposing drafts", () => {
  const post = { ...published("test-post"), cover: "assets/test-cover.jpg", excerpt: "[Excerpt]", tags: ["[Tag]"] };
  try {
    blogPosts.push(post, blogPost("private-draft", "[Private draft]", { content: "[Private text]" }));
    const directory = render(BlogPage);
    assert(directory.includes('href="#blog/test-post"'));
    assert(directory.includes("[Excerpt]"));
    assert(!directory.includes("Private"));
    const article = render(BlogPostPage, { post });
    for (const value of ["[Test title]", 'dateTime="2026-10-28"', "/assets/test-cover.jpg", "[Test article]", "[Second paragraph]", "[Tag]"]) assert(article.includes(value), value);
    assert.equal(render(BlogPostPage, { post: blogPosts[1] }), "");
    assert(!article.includes("Newsletter"));
  } finally {
    blogPosts.length = 0;
  }
});

const sourceFixture = `
export function blogPost(slug, title, options = {}) { return { slug, title, ...options }; }
export const blogPosts = [
  blogPost("private-draft-slug", "PRIVATE_DRAFT_TITLE", {
    status: "draft", content: "PRIVATE_DRAFT_BODY", excerpt: "PRIVATE_DRAFT_EXCERPT", tags: ["PRIVATE_DRAFT_TAG"]
  }),
  blogPost("implicit-draft", "PRIVATE_IMPLICIT_DRAFT", { content: "PRIVATE_IMPLICIT_BODY" }),
  blogPost("public-post", "PUBLIC_POST_TITLE", {
    status: "published", publicationDate: "2026-10-28", content: "PUBLIC_POST_BODY"
  }),
];`;

test("content compilation removes all draft data before it reaches the client", () => {
  const result = publicBlogSource(sourceFixture);
  assert(!/PRIVATE_|private-draft-slug|implicit-draft/.test(result));
  assert(result.includes("PUBLIC_POST_TITLE"));
  assert(result.includes("PUBLIC_POST_BODY"));
});

test("dynamic blog declarations and duplicate slugs fail closed", () => {
  for (const source of [
    "export const blogPosts = getPosts();",
    "export const blogPosts = [somePost];",
    'export const blogPosts = [blogPost("test", "Title", { ...options })];',
    'export const blogPosts = [blogPost("test", "Title", { status: value })];',
    'export const blogPosts = [blogPost("test", "Title", { content: privateText })];',
    'export const blogPosts = [blogPost("test", "Title"), blogPost("test", "Duplicate")];',
  ]) assert.throws(() => publicBlogSource(source));
});

test("real production bundling retains published text and excludes private draft text and maps", async () => {
  const root = await mkdtemp(join(tmpdir(), "portfolio-blog-test-"));
  try {
    await mkdir(join(root, "src"));
    await writeFile(join(root, "src/content.ts"), sourceFixture);
    await writeFile(join(root, "entry.js"), 'import { blogPosts } from "./src/content.ts"; console.log(blogPosts);');
    const result = await build({
      root, configFile: false, publicDir: false, logLevel: "silent", plugins: [publicBlogContent()],
      build: { write: false, sourcemap: true, rollupOptions: { input: join(root, "entry.js") } },
    });
    const outputs = (Array.isArray(result) ? result : [result]).flatMap((bundle) => bundle.output);
    const text = outputs.map((output) => output.type === "chunk" ? output.code : String(output.source)).join("\n");
    assert(text.includes("PUBLIC_POST_TITLE"));
    assert(text.includes("PUBLIC_POST_BODY"));
    assert(!/PRIVATE_|private-draft-slug|implicit-draft/.test(text));
    assert(!outputs.some((output) => output.fileName.endsWith(".map")));
  } finally {
    assert.equal(dirname(resolve(root)), resolve(tmpdir()));
    assert(basename(root).startsWith("portfolio-blog-test-"));
    await rm(root, { recursive: true, force: true });
  }
});
