import ts from "typescript";
import type { Plugin } from "vite";

// Remove drafts before Vite/React see their text. A runtime filter alone would
// still ship the original data to the browser. Inline literal entries make this
// auditable without evaluating content or adding a build dependency.
export function publicBlogSource(source: string, filename = "content.ts"): string {
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let entries: ts.ArrayLiteralExpression | undefined;
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(file) !== "blogPosts") continue;
      if (!declaration.initializer || !ts.isArrayLiteralExpression(declaration.initializer)) {
        throw new Error("blogPosts must be an inline array of blogPost() calls in content.ts.");
      }
      entries = declaration.initializer;
    }
  }
  if (!entries) throw new Error("The blogPosts array is required for draft-safe content compilation.");

  const slugs = new Set<string>();
  const publicEntries: string[] = [];
  for (const entry of entries.elements) {
    if (!ts.isCallExpression(entry) || !ts.isIdentifier(entry.expression) || entry.expression.text !== "blogPost"
      || entry.arguments.length < 2 || entry.arguments.length > 3
      || !ts.isStringLiteralLike(entry.arguments[0]) || !ts.isStringLiteralLike(entry.arguments[1])) {
      throw new Error("Use inline blogPost(\"slug\", \"Title\", { ... }) calls with literal values.");
    }
    const slug = entry.arguments[0].text;
    if (slugs.has(slug)) throw new Error(`Duplicate blog slug: ${slug}`);
    slugs.add(slug);
    let published = false;
    const options = entry.arguments[2];
    if (options) {
      if (!ts.isObjectLiteralExpression(options)) throw new Error("Blog options must be inline literal objects.");
      const fields = new Set<string>();
      for (const field of options.properties) {
        if (!ts.isPropertyAssignment(field) || (!ts.isIdentifier(field.name) && !ts.isStringLiteral(field.name))) {
          throw new Error("Blog options cannot use spreads, shorthand properties, or computed fields.");
        }
        const name = field.name.text;
        if (fields.has(name)) throw new Error(`Duplicate blog field: ${name}`);
        fields.add(name);
        const value = field.initializer;
        if (name === "tags") {
          if (!ts.isArrayLiteralExpression(value) || !value.elements.every(ts.isStringLiteralLike)) {
            throw new Error("Blog tags must be an inline array of strings.");
          }
        } else {
          if (!["publicationDate", "cover", "excerpt", "content", "status"].includes(name) || !ts.isStringLiteralLike(value)) {
            throw new Error("Blog fields must use literal strings, including plain-text article content.");
          }
          if (name === "status") {
            if (value.text !== "draft" && value.text !== "published") throw new Error("Blog status must be draft or published.");
            published = value.text === "published";
          }
        }
      }
    }
    if (published) publicEntries.push(entry.getText(file));
  }
  return source.slice(0, entries.getStart(file)) + `[${publicEntries.join(",\n")}]` + source.slice(entries.end);
}

export function publicBlogContent(): Plugin {
  return {
    name: "public-blog-content",
    enforce: "pre",
    // Production source maps must not contain the unredacted source file.
    config: () => ({ build: { sourcemap: false } }),
    configResolved(config) {
      if (config.build.sourcemap) throw new Error("Draft-safe blog builds require production source maps to be disabled.");
    },
    transform(source, id) {
      if (!id.replace(/\\/g, "/").split("?")[0].endsWith("/src/content.ts")) return;
      return {
        code: publicBlogSource(source, id),
        map: { version: 3, sources: [], names: [], mappings: "" },
      };
    },
  };
}
