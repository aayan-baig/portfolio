import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AboutPage from "../src/pages/AboutPage.tsx";
import InterestPage from "../src/pages/InterestPage.tsx";
import BirthdayAge from "../src/components/BirthdayAge.tsx";
import { ageOnDate, birthdayLabel } from "../src/about.ts";
import { about, profile, capability, interest, image, link, section } from "../src/content.ts";

const render = (Component, props = {}) => renderToStaticMarkup(React.createElement(Component, props));

test("age advances at the birthday boundary in Mumbai, not the visitor's calendar", () => {
  assert.equal(ageOnDate("2009-10-26", new Date("2026-10-25T18:29:59.999Z")), 16);
  assert.equal(ageOnDate("2009-10-26", new Date("2026-10-25T18:30:00.000Z")), 17);
  assert.equal(ageOnDate("2009-10-26", new Date("2026-12-31T23:00:00Z")), 17);
  assert.equal(ageOnDate("2009-10-26", new Date("2027-10-26T00:00:00Z")), 18);
  assert.equal(ageOnDate("2009-10-26", new Date("2009-10-26T00:00:00Z")), 0);
});

test("invalid dates and dates before birth produce no misleading age", () => {
  for (const date of ["", "not-a-date", "2009-02-29", "2009-13-26", "09-10-26"]) {
    assert.equal(ageOnDate(date), null);
    assert.equal(birthdayLabel(date), "");
  }
  assert.equal(ageOnDate("2009-10-26", new Date("2009-10-25T00:00:00Z")), null);
  assert.equal(ageOnDate("2009-10-26", new Date("invalid")), null);
  assert.equal(ageOnDate("2008-02-29", new Date("2024-02-29T00:00:00Z")), 16);
});

test("birthday text is derived from the configured date and linked to a focusable button", () => {
  assert.equal(birthdayLabel(profile.birthDate), "October 26");
  assert.equal(birthdayLabel(profile.birthDate, true), "October 26, 2009");
  const message = about.birthdayWish.replace("{birthday}", birthdayLabel(profile.birthDate));
  assert.equal(message, "Wish me on October 26!");
  const html = render(BirthdayAge, { birthDate: profile.birthDate, message });
  assert(html.includes('<button type="button"'));
  const tooltipId = html.match(/aria-describedby="([^"]+)"/)?.[1];
  assert(tooltipId);
  assert(html.includes(`id="${tooltipId}" role="tooltip"`));
  assert(html.includes('aria-expanded="false"'));
  assert(html.includes('hidden=""'));
  assert(html.includes(message));
  assert.equal(render(BirthdayAge, { birthDate: "", message }), "");
});

test("About displays the supplied biography, history, and interests without invented inventories", () => {
  const html = render(AboutPage);
  assert(html.includes("Hey, I&#x27;m Aayan!"));
  for (const text of ["Mumbai, India", "2009-10-26", "2016", "Python", "How It Started", "What I Do", "Outside Computing", "perfect pitch", "approximately ten years", "Microsoft Flight Simulator", "X-Plane", "VATSIM", "Motorsport", "motorsport and racing"]) assert(html.includes(text), text);
  assert.equal(about.capabilities.length, 6);
  for (const item of about.capabilities) {
    assert(html.includes(item.name.replaceAll("&", "&amp;")));
    assert.deepEqual(item.projectIds, []);
    assert.equal(item.experienceLevel, undefined);
  }
  const verified = new Set(["Python", "JavaScript", "TypeScript", "C", "C++", "Rust", "Assembly", "Dart", "HTML", "CSS", "React", "Node.js", "Flutter", "AWS", "Docker", "Git", "PostgreSQL"]);
  assert.deepEqual(new Set(about.capabilities.flatMap((item) => item.skills)), verified);
  assert(!/Related work:|<progress|aria-valuenow|\u2014/.test(html));
});

test("obsolete About disclosures and Basketball are removed, with clear interest-page links", () => {
  const html = render(AboutPage);
  assert(!/<details|<summary|Click for nerds|Beyond applications|More about|Basketball|point guard|shooting guard/.test(html));
  assert.deepEqual(about.interests.map((item) => item.id), ["music", "aviation", "motorsport"]);
  assert(!("technicalDetailsLabel" in about));
  assert(!("technicalNotes" in about));
  for (const item of about.interests) {
    assert(html.includes(`href="#${item.id}"`));
    assert(html.includes(`Explore ${item.title}`));
    assert(!("details" in item));
    assert.deepEqual(item.images, []);
    assert.deepEqual(item.links, []);
  }
});

test("portrait defaults to an honest placeholder and uses a configurable non-linked image", () => {
  const original = about.portrait;
  try {
    const empty = render(AboutPage);
    assert(empty.includes(about.portraitPlaceholder));
    assert(!empty.includes('src=""'));
    about.portrait = image("assets/test-portrait.jpg", "[Portrait caption]");
    const html = render(AboutPage);
    const figure = html.match(/<figure class="about-portrait">([\s\S]*?)<\/figure>/)?.[1];
    assert(figure?.includes('src="/assets/test-portrait.jpg"'));
    assert(figure.includes('alt="[Portrait caption]"'));
    assert(!figure.includes("<a"));
    assert(!figure.includes(about.portraitPlaceholder));
  } finally {
    about.portrait = original;
  }
});

test("optional capabilities, supporting links, notes, and interest media render only when populated", () => {
  const originalCapabilities = about.capabilities;
  const originalInterests = about.interests;
  try {
    about.capabilities = [capability("test", "[Capability]", "[Description]", {
      skills: ["[Skill]"], experienceLevel: "[Supplied level]", projectIds: ["bluemoon", "missing-project"],
      technicalNotes: [section("[Technical heading]", "[Technical note]")],
    })];
    about.interests = [interest("test", "[Interest]", "[Summary]", {
      images: [image("assets/test-interest.jpg", "[Interest image]")],
      links: [link("[Interest link]", "https://example.invalid/interest")],
      sections: [section("[Detail heading]", "[Detail text]")],
    })];
    const html = render(AboutPage);
    for (const text of ["[Capability]", "[Skill]", "[Supplied level]", "[Technical note]", 'href="#bluemoon"', "[Interest]", 'href="#test"']) assert(html.includes(text), text);
    assert(!html.includes('href="#missing-project"'));
    assert(!html.includes("<details"));
    const personalPage = render(InterestPage, { interest: about.interests[0] });
    for (const text of ["[Detail text]", "/assets/test-interest.jpg", "https://example.invalid/interest"]) assert(personalPage.includes(text), text);
    assert(!html.includes("/assets/test-interest.jpg"));
    about.capabilities = [];
    about.interests = [];
    const empty = render(AboutPage);
    assert(!empty.includes('id="about-capabilities-heading"'));
    assert(!empty.includes('id="about-outside-heading"'));
    assert(!empty.includes("about-interest-images"));
  } finally {
    about.capabilities = originalCapabilities;
    about.interests = originalInterests;
  }
});

test("approved introduction and history retain two and four separate paragraphs", () => {
  const html = render(AboutPage);
  const introduction = html.match(/class="about-intro-copy">([\s\S]*?)<dl/)?.[1];
  assert(introduction);
  assert.equal((introduction.match(/<p>/g) || []).length, 2);
  const history = html.match(/<h2>How It Started<\/h2>([\s\S]*?)<\/section>/)?.[1];
  assert(history);
  assert.equal((history.match(/<p>/g) || []).length, 4);
  for (const paragraph of about.history.text.split("\n\n")) assert(history.includes(paragraph.replaceAll("'", "&#x27;")));
  assert(!html.includes("Specific tools and experience details are listed only where provided"));
  assert(!about.introduction.includes("17"));
  assert(!html.includes("{age}"));
  assert(html.includes(about.closing.text.replaceAll("'", "&#x27;")));
  assert.equal((html.match(/class="about-capability"/g) || []).length, 6);
  assert.equal((html.match(/class="about-skill-inventory"/g) || []).length, 3);
});

test("the introduction embeds one live age control and changes correctly in future years", () => {
  const ActualDate = globalThis.Date;
  try {
    for (const [date, expected] of [["2026-10-28T12:00:00Z", "17"], ["2027-10-28T12:00:00Z", "18"]]) {
      globalThis.Date = class extends ActualDate {
        constructor(...args) { super(...(args.length ? args : [date])); }
        static now() { return new ActualDate(date).getTime(); }
      };
      const html = render(AboutPage);
      assert.equal((html.match(/class="birthday-age"/g) || []).length, 1);
      assert.equal(html.match(/class="birthday-age"[^>]*>(\d+)/)?.[1], expected);
      assert(html.indexOf('class="birthday-age"') < html.indexOf('<dl class="about-facts"'));
      assert(html.includes("Wish me on October 26!"));
      const withoutAgeButton = html.replace(/<button[^>]*class="birthday-age"[\s\S]*?<\/button>/, "");
      assert(!/\b17\b|\b18\b/.test(withoutAgeButton));
      assert(!html.includes("<dt>Age</dt>"));
    }
  } finally {
    globalThis.Date = ActualDate;
  }
});
