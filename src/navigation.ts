import { findPublishedPost } from "./blog";
import { about, projects } from "./content";
import type { IconName } from "./icons";

export type PageId = "home" | "projects" | "research" | "about" | "experience" | "education" | "achievements" | "documents" | "contact" | "settings" | "blog";
export type PageDefinition = { id: PageId; title: string; icon: IconName };

export const PAGES: PageDefinition[] = [
  { id: "projects", title: "Projects", icon: "folder" },
  { id: "research", title: "Research", icon: "text" },
  { id: "about", title: "About", icon: "computer" },
  { id: "experience", title: "Experience", icon: "programs" },
  { id: "education", title: "Education", icon: "documents" },
  { id: "achievements", title: "Achievements", icon: "folderOpen" },
  { id: "documents", title: "Documents", icon: "document" },
  { id: "contact", title: "Contact", icon: "internet" },
  { id: "blog", title: "Blog", icon: "text" },
];

export function hrefFor(id: string): string {
  return id.startsWith("blog/")
    ? `#blog/${encodeURIComponent(id.slice(5))}`
    : `#${encodeURIComponent(id)}`;
}

export function routeFromHash(hash: string): string {
  try {
    return decodeURIComponent(hash.replace(/^#\/?/, "")) || "home";
  } catch {
    return "not-found";
  }
}

export function currentRoute(): string {
  return routeFromHash(window.location.hash);
}

export function subscribeRoute(callback: () => void): () => void {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

export function routeTitle(id: string): string {
  if (id === "home") return "Main menu";
  if (id === "settings") return "Settings";
  return PAGES.find((page) => page.id === id)?.title
    ?? projects.find((project) => project.id === id)?.title
    ?? findPublishedPost(id)?.title
    ?? about.interests.find((interest) => interest.id === id)?.title
    ?? "Page not found";
}

export function parentRoute(id: string): string {
  if (id.startsWith("blog/")) return "blog";
  if (about.interests.some((interest) => interest.id === id)) return "about";
  return projects.some((project) => project.id === id) ? "projects" : "home";
}

export type MenuRect = { left: number; top: number; width: number; height: number };

// Select the nearest tile in the requested direction, using its actual layout.
// This works with the asymmetric desktop menu and the stacked mobile menu.
export function directionalIndex(rects: MenuRect[], current: number, key: string): number {
  const origin = rects[current];
  if (!origin) return current;
  const horizontal = key === "ArrowLeft" || key === "ArrowRight";
  const sign = key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1;
  const x = origin.left + origin.width / 2;
  const y = origin.top + origin.height / 2;
  let best = current;
  let bestScore = Infinity;
  rects.forEach((rect, index) => {
    if (index === current) return;
    // A tile spanning several cells is not to the left or above itself.
    // Compare edges first so short neighboring tiles do not cause diagonal jumps.
    if (key === "ArrowLeft" && rect.left + rect.width > origin.left + 1) return;
    if (key === "ArrowRight" && rect.left < origin.left + origin.width - 1) return;
    if (key === "ArrowUp" && rect.top + rect.height > origin.top + 1) return;
    if (key === "ArrowDown" && rect.top < origin.top + origin.height - 1) return;
    const dx = rect.left + rect.width / 2 - x;
    const dy = rect.top + rect.height / 2 - y;
    const forward = (horizontal ? dx : dy) * sign;
    const sideways = Math.abs(horizontal ? dy : dx);
    if (forward <= 1) return;
    const score = forward + sideways * 2;
    if (score < bestScore) {
      bestScore = score;
      best = index;
    }
  });
  return best;
}
