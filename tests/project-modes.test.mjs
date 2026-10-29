import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { project, section, link } from "../src/content.ts";
import ProjectPage from "../src/pages/ProjectPage.tsx";
import ProjectExplanation from "../src/components/ProjectExplanation.tsx";
import TechnicalConfirmation from "../src/components/TechnicalConfirmation.tsx";

const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));

test("project helper supports independent, partial explanation data without invented defaults", () => {
  const first = project("first", "[First]");
  const second = project("second", "[Second]", { simple: { whatItIs: "[Plain language]" }, technical: { architecture: "[Architecture]" } });
  assert.equal(Object.keys(first.simple).length, 7);
  assert.equal(Object.keys(first.technical).length, 9);
  assert(Object.values(first.simple).every((value) => value === ""));
  assert(Object.values(first.technical).every((value) => value === ""));
  assert.equal(second.simple.whatItIs, "[Plain language]");
  assert.equal(second.technical.architecture, "[Architecture]");
  second.simple.whatItIs = "[Changed]";
  assert.equal(first.simple.whatItIs, "");
});

test("Simple renders the entire accessible narrative with multiple paragraphs and no specification fallback", () => {
  const entry = project("test", "[Project]", {
    subtitle: "[Unexplained technical subtitle]", description: "[Legacy technical specification]",
    technologies: ["[Specific technology]"], sections: [section("[Legacy section]", "[Technical notes]")],
    simple: {
      whatItIs: "[What it is in ordinary language]\n\n[Further explanation without a length limit]",
      whyItExists: "[Why it exists]", whatItDoes: "[What it does]", howItWorks: "[Conceptual explanation]",
      accomplishments: "[Verified accomplishments]", challenges: "[Encountered challenges]", plannedWork: "[Future plans]",
    },
    technical: { architecture: "[Private to technical presentation]" },
  });
  const html = render(ProjectPage, { project: entry });
  for (const value of Object.values(entry.simple).flatMap((text) => text.split("\n\n"))) assert(html.includes(value), value);
  for (const value of [entry.subtitle, entry.description, entry.technologies[0], entry.sections[0].text, entry.technical.architecture]) assert(!html.includes(value), value);
  assert(html.includes(">For Nerds</button>"));
  assert(!html.includes("technical-confirmation"));
  assert(!html.includes("Okay, back to English"));
});

test("empty Simple does not turn a technical description into a summary or specifications list", () => {
  const entry = project("test", "[Project]", { description: "[Technical description]", sections: [section("[Technical section]", "[Technical text]")] });
  const html = render(ProjectExplanation, { project: entry, mode: "simple" });
  assert(html.includes("A plain-language explanation has not been published"));
  assert(!html.includes(entry.description));
  assert(!html.includes(entry.sections[0].text));
  assert(!html.includes("reading-panel"));
});

test("technical view renders full documentation fields, legacy technical sections, and documentation links", () => {
  const entry = project("test", "[Project]", {
    simple: { whatItIs: "[Simple narrative only]" },
    subtitle: "[Technical subtitle]", description: "[Technical overview]",
    technical: {
      architecture: "[Architecture]", implementation: "[Implementation]", algorithms: "[Algorithms]", interfaces: "[Interfaces]",
      tradeOffs: "[Trade-offs]", testing: "[Testing evidence]", limitations: "[Limitations]", researchFindings: "[Research findings]", plannedWork: "[Engineering plans]",
    },
    sections: [section("[Additional topic]", "[Full additional documentation]\n\n[More detail]")],
    documentation: [link("[Documentation]", "https://example.invalid/docs")],
  });
  const html = render(ProjectExplanation, { project: entry, mode: "technical" });
  for (const text of [...Object.values(entry.technical), entry.subtitle, entry.description, "[Full additional documentation]", "[More detail]", "https://example.invalid/docs"]) assert(html.includes(text), text);
  assert(!html.includes(entry.simple.whatItIs));
  assert(!html.includes("Technical documentation has not been published"));
});

test("confirmation has the specified copy, native modal semantics, and both real actions", () => {
  const html = render(TechnicalConfirmation, { onConfirm() {}, onDismiss() {} });
  assert(html.includes("<dialog"));
  assert(html.includes('aria-modal="true"'));
  const titleId = html.match(/aria-labelledby="([^"]+)"/)?.[1];
  const messageId = html.match(/aria-describedby="([^"]+)"/)?.[1];
  assert(titleId && messageId);
  assert(html.includes(`id="${titleId}">Are you sure?</h2>`));
  assert(html.includes(`id="${messageId}">You&#x27;re entering nerd territory. Things are about to get considerably more technical. Continue?</p>`));
  assert(html.includes(">Never mind</button>"));
  assert(html.includes(">I&#x27;m sure</button>"));
  assert.equal((html.match(/<button/g) || []).length, 2);
});
