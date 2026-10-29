import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import App from "../src/App.tsx";
import HomePage from "../src/pages/HomePage.tsx";
import ProjectsPage from "../src/pages/ProjectsPage.tsx";
import ProjectExplanation from "../src/components/ProjectExplanation.tsx";
import ProjectPage from "../src/pages/ProjectPage.tsx";
import SettingsPage from "../src/pages/SettingsPage.tsx";
import { AboutPage, ExperiencePage, EducationPage, AchievementsPage, DocumentsPage, ContactPage } from "../src/pages/InfoPages.tsx";
import { about, projects, profile, experiences, educationHistory, achievements, documents, project, experience, education, achievement, section, image, link } from "../src/content.ts";

const render = (Component, props = {}) => renderToStaticMarkup(React.createElement(Component, props));
test("the shell and home menu expose real links, bitmap icons, and no desktop chrome", () => {
  const html = render(App);
  assert(html.includes(profile.welcome));
  for (const id of ["projects", "research", "about", "experience", "education", "achievements", "documents", "contact", "blog"]) assert(html.includes(`href="#${id}"`));
  assert(html.includes("Windows%202000"));
  assert(html.includes('href="#settings"'));
  assert(!/retro-window|retro-taskbar|retro-desktop|Start menu|coming soon|\u2014/.test(html));
  assert.equal((html.match(/href="#home"/g) || []).length, 1);
  assert(!/<footer[^>]*>[\s\S]*?<a/.test(html));
  assert(!html.includes("choice-number"));
  assert(html.includes("05 PROJECTS"));
  assert.equal((render(HomePage).match(/data-menu-item=""/g) || []).length, 9);
});
test("all five project records share one navigable library", () => {
  const html = render(ProjectsPage);
  assert.equal((html.match(/data-menu-item=""/g) || []).length, 5);
  assert.equal((html.match(/class="project-library"/g) || []).length, 1);
  for (const entry of projects) {
    assert(html.includes(entry.title));
    assert(html.includes(`href="#${entry.id}"`));
  }
  assert(!html.includes("NSELiveScanner"));
  assert(!html.includes("choice-number"));
});
test("empty projects hide optional sections and retain their identity and navigation", () => {
  for (const entry of projects) {
    const html = render(ProjectPage, { project: entry });
    assert(html.includes(entry.title));
    assert(html.includes('aria-label="Other projects"'));
    assert(!/Overview|Screenshots &amp; media|Technologies|Documentation|External links|coming soon/.test(html));
  }
});
test("project descriptions, media, sections, docs, status, and technologies render from data", () => {
  const entry = project("sample", "[Project title]", {
    subtitle: "[Subtitle]", description: "[Description]", status: "[Status]", cover: "assets/sample.jpg",
    technologies: ["[Technology]"], sections: [section("[Section title]", "[Section text]")],
    images: [image("assets/screenshot.png", "[Caption]")],
    documentation: [link("[Documentation]", "https://example.invalid/docs")],
    links: [link("[Source]", "https://example.invalid/source")],
  });
  const html = render(ProjectPage, { project: entry }) + render(ProjectExplanation, { project: entry, mode: "technical" });
  for (const value of ["[Subtitle]", "[Description]", "[Status]", "[Section title]", "[Section text]", "[Caption]", "[Documentation]", "[Source]", "/assets/sample.jpg", "/assets/screenshot.png"]) assert(html.includes(value), value);
});
test("professional entries can be populated without editing components", () => {
  const originalProfile = { ...profile };
  const originalIntroduction = about.introduction;
  try {
    about.introduction = "[Biography]";
    profile.interests = ["[Interest]"];
    profile.email = "placeholder@example.invalid";
    experiences.push(experience("sample", "[Role]", "[Organization]", { description: "[Experience]" }));
    educationHistory.push(education("[Institution]", "[Qualification]"));
    achievements.push(achievement("[Achievement]", "[Organization]"));
    documents.push(link("[Document]", "https://example.invalid/document"));
    for (const [Component, value] of [[AboutPage, "[Biography]"], [ExperiencePage, "[Experience]"], [EducationPage, "[Qualification]"], [AchievementsPage, "[Achievement]"], [DocumentsPage, "[Document]"], [ContactPage, "placeholder@example.invalid"]]) assert(render(Component).includes(value));
  } finally {
    Object.assign(profile, originalProfile);
    about.introduction = originalIntroduction;
    experiences.length = 0; educationHistory.length = 0; achievements.length = 0; documents.length = 0;
  }
});
test("settings offers only functional theme choices and reset", () => {
  const html = render(SettingsPage, { preferences: { theme: "evergreen" }, onChange() {}, onReset() {} });
  assert.equal((html.match(/type="radio"/g) || []).length, 3);
  assert(html.match(/<input[^>]*value="evergreen"[^>]*>/)?.[0].includes('checked=""'));
  assert(html.includes("Restore Defaults"));
  assert(!/wallpaper|Active Desktop|Sound|Volume/.test(html));
});
