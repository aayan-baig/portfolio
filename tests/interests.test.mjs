import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { about, interest, image, link, section, projects } from "../src/content.ts";
import { PAGES, hrefFor, routeFromHash, routeTitle, parentRoute, currentRoute, subscribeRoute } from "../src/navigation.ts";
import InterestPage from "../src/pages/InterestPage.tsx";
import HomePage from "../src/pages/HomePage.tsx";
import ProjectPage from "../src/pages/ProjectPage.tsx";
import TechnicalConfirmation from "../src/components/TechnicalConfirmation.tsx";

const render = (Component, props = {}) => renderToStaticMarkup(React.createElement(Component, props));

test("all interest routes have direct URLs, correct titles, and About as their parent", () => {
  for (const item of about.interests) {
    assert.equal(routeFromHash(hrefFor(item.id)), item.id);
    assert.equal(routeTitle(item.id), item.title);
    assert.equal(parentRoute(item.id), "about");
    assert(!PAGES.some((page) => page.id === item.id));
  }
  assert.equal(routeTitle("basketball"), "Page not found");
  const home = render(HomePage);
  for (const id of ["music", "aviation", "motorsport"]) assert(!home.includes(`href="#${id}"`));
  assert.equal((home.match(/data-menu-item=""/g) || []).length, 9);
});

test("interest pages contain the supplied facts and no project explanation controls", () => {
  for (const item of about.interests) {
    const html = render(InterestPage, { interest: item });
    assert(html.includes(`<h1>${item.title}</h1>`));
    assert(!/For Nerds|Click for nerds|technical-confirmation|<details|<summary|Okay, back to English|Basketball/.test(html));
    assert(!html.includes("media-gallery"));
    assert(!html.includes("Personal background"));
  }
  const music = render(InterestPage, { interest: about.interests[0] });
  assert(music.includes("perfect pitch"));
  assert(music.includes("approximately ten years"));
  assert(music.includes("MIDI keyboards"));
  const aviation = render(InterestPage, { interest: about.interests[1] });
  for (const text of ["Microsoft Flight Simulator", "X-Plane", "VATSIM"]) assert(aviation.includes(text));
  assert(render(InterestPage, { interest: about.interests[2] }).includes("motorsport and racing"));
});

test("interest helpers support optional sections and local photographs without empty containers", () => {
  const entry = interest("test", "[Interest]", "[Summary]", {
    introduction: "[Introduction]", background: "[Background]",
    activities: [section("[Activity]", "[Experience]")],
    sections: [section("[Section]", "[Section text]")],
    notes: [section("[Note]", "[Note text]")],
    images: [image("assets/test-interest.jpg", "[Caption]")],
    links: [link("[Link]", "https://example.invalid/interest")],
  });
  const html = render(InterestPage, { interest: entry });
  for (const value of ["[Introduction]", "[Background]", "[Experience]", "[Section text]", "[Note text]", "/assets/test-interest.jpg", "[Caption]", "https://example.invalid/interest"]) assert(html.includes(value), value);
  const empty = render(InterestPage, { interest: interest("empty", "[Empty]", "", {
    activities: [section("[Empty activity]", "")], images: [image("")], links: [link("[Empty link]", "")],
  }) });
  assert(!/reading-panel|media-gallery|Personal background|Activities|Additional notes|<img[^>]*src=""/.test(empty));
});

test("interest hash changes participate in the same history subscription", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  const browser = new EventTarget();
  browser.location = { hash: "#about" };
  globalThis.window = browser;
  const visited = [];
  const unsubscribe = subscribeRoute(() => visited.push(currentRoute()));
  try {
    for (const hash of ["#music", "#about", "#aviation", "#about", "#motorsport", "#about"]) {
      browser.location.hash = hash;
      browser.dispatchEvent(new Event("hashchange"));
    }
    assert.deepEqual(visited, ["music", "about", "aviation", "about", "motorsport", "about"]);
  } finally {
    unsubscribe();
    if (original) Object.defineProperty(globalThis, "window", original);
    else delete globalThis.window;
  }
});

test("professional projects retain their distinct For Nerds system", () => {
  for (const project of projects) {
    assert.equal(parentRoute(project.id), "projects");
    assert(render(ProjectPage, { project }).includes(">For Nerds</button>"));
  }
  const dialog = render(TechnicalConfirmation, { onConfirm() {}, onDismiss() {} });
  assert(dialog.includes("Are you sure?"));
  assert(dialog.includes("considerably more technical"));
  assert(dialog.includes('aria-modal="true"'));
});
