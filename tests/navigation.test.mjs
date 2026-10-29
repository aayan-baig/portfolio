import assert from "node:assert/strict";
import { test } from "node:test";
import { routeFromHash, routeTitle, hrefFor, parentRoute, directionalIndex, currentRoute, subscribeRoute } from "../src/navigation.ts";
import { projects } from "../src/content.ts";

test("all original page and project hash links remain addressable", () => {
  for (const id of ["home", "projects", "research", "about", "experience", "education", "achievements", "documents", "contact", "settings", "blog", ...projects.map((p) => p.id)]) {
    assert.equal(routeFromHash(hrefFor(id)), id);
    assert.notEqual(routeTitle(id), "Page not found");
  }
  assert.equal(routeTitle("nselivescanner"), "Stock Scanner");
  assert.equal(routeTitle("echo"), "Page not found");
});
test("empty, malformed, encoded, and unknown routes are handled", () => {
  assert.equal(routeFromHash(""), "home");
  assert.equal(routeFromHash("#"), "home");
  assert.equal(routeFromHash("#/projects"), "projects");
  assert.equal(routeFromHash("#%62luemoon"), "bluemoon");
  assert.equal(routeFromHash("#%E0%A4%A"), "not-found");
  assert.equal(routeTitle("missing"), "Page not found");
});
test("Back and Escape destinations retain a clear hierarchy", () => {
  for (const project of projects) assert.equal(parentRoute(project.id), "projects");
  for (const page of ["about", "settings", "projects", "research", "missing"]) assert.equal(parentRoute(page), "home");
});
test("hash change notifications follow forward and backward route changes", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  const browser = new EventTarget();
  browser.location = { hash: "#home" };
  globalThis.window = browser;
  const visited = [];
  const unsubscribe = subscribeRoute(() => visited.push(currentRoute()));
  try {
    // Browsers emit the same event for native link clicks and history traversal.
    for (const hash of ["#projects", "#bluemoon", "#projects", "#blog", "#blog/test-post", "#blog", "#home"]) {
      browser.location.hash = hash;
      browser.dispatchEvent(new Event("hashchange"));
    }
    assert.deepEqual(visited, ["projects", "bluemoon", "projects", "blog", "blog/test-post", "blog", "home"]);
    unsubscribe();
    browser.location.hash = "#contact";
    browser.dispatchEvent(new Event("hashchange"));
    assert.equal(visited.length, 7);
  } finally {
    unsubscribe();
    if (original) Object.defineProperty(globalThis, "window", original);
    else delete globalThis.window;
  }
});
test("arrow keys follow the asymmetric tile layout", () => {
  const rects = [
    { left: 0, top: 0, width: 210, height: 210 },
    { left: 220, top: 0, width: 210, height: 100 },
    { left: 220, top: 110, width: 100, height: 100 },
    { left: 330, top: 110, width: 100, height: 100 },
    { left: 0, top: 220, width: 100, height: 100 },
    { left: 110, top: 220, width: 100, height: 100 },
  ];
  assert.equal(directionalIndex(rects, 0, "ArrowLeft"), 0);
  assert.equal(directionalIndex(rects, 0, "ArrowUp"), 0);
  assert.equal(directionalIndex(rects, 2, "ArrowRight"), 3);
  assert.equal(directionalIndex(rects, 2, "ArrowUp"), 1);
  assert.equal(directionalIndex(rects, 3, "ArrowLeft"), 2);
  assert.equal(directionalIndex(rects, 4, "ArrowRight"), 5);
});
test("arrow movement adapts to stacked mobile rows and single entries", () => {
  const rects = [0, 1, 2].map((i) => ({ left: 0, top: i * 100, width: 300, height: 90 }));
  assert.equal(directionalIndex(rects, 0, "ArrowDown"), 1);
  assert.equal(directionalIndex(rects, 1, "ArrowDown"), 2);
  assert.equal(directionalIndex(rects, 2, "ArrowDown"), 2);
  assert.equal(directionalIndex(rects, 1, "ArrowUp"), 0);
  assert.equal(directionalIndex(rects, 0, "ArrowRight"), 0);
  assert.equal(directionalIndex([], 0, "ArrowRight"), 0);
});

test("Blog's final row remains reachable with desktop and mobile arrow navigation", () => {
  const desktop = [
    { left: 0, top: 220, width: 100, height: 100 },
    { left: 110, top: 220, width: 100, height: 100 },
    { left: 0, top: 330, width: 430, height: 60 },
  ];
  assert.equal(directionalIndex(desktop, 0, "ArrowDown"), 2);
  assert.equal(directionalIndex(desktop, 2, "ArrowUp"), 1);
  const mobile = [
    { left: 0, top: 500, width: 140, height: 98 },
    { left: 149, top: 500, width: 140, height: 98 },
    { left: 0, top: 607, width: 289, height: 60 },
  ];
  assert.equal(directionalIndex(mobile, 0, "ArrowDown"), 2);
  assert.equal(directionalIndex(mobile, 1, "ArrowDown"), 2);
  assert.equal(directionalIndex(mobile, 2, "ArrowDown"), 2);
});
