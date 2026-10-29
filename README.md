# Aayan Baig portfolio

A React + TypeScript + Vite portfolio with a console-inspired main menu, software library, and readable professional pages. No server, account, analytics, cookies, or external storage is required.

## Develop and verify

```sh
npm install
npm run dev
npm run build
npm run lint
npm test
```

The build runs TypeScript project checks before generating `dist/`. Tests use Node's built-in test runner and the existing TypeScript compiler. Use Node 24 or later for the test runner's module hooks.

## Edit content

`src/content.ts` is the source of truth for profile information, the welcome message, projects, research, experience, education, achievements, documents, and contact links. The existing `project()`, `experience()`, `education()`, `achievement()`, `section()`, `image()`, and `link()` helpers remain available.

Add project entries to `projects`. Optional project fields include `subtitle`, `description`, `status`, `technologies`, `cover`, `sections`, `images`, `links`, and `documentation` (a list of `link()` values). A project with `category: "Research"` also appears on the Research page. Categories do not group the library.

Add experience, education, achievement, or document entries to their corresponding arrays. Empty optional fields are hidden. No component or stylesheet edits are needed to add entries. The existing names are placeholders; no professional claims are supplied.

Place covers and screenshots in `public/assets/` and refer to them as `assets/...`. Missing cover art uses an existing Windows 2000 folder icon. Downloaded media and its licensing information remain under `public/assets/wallpapers/`; the console interface does not use the photograph as its background.

## Navigation and preferences

Native hash links preserve static-host compatibility and browser history: `#home`, `#projects`, `#research`, `#about`, `#experience`, `#education`, `#achievements`, `#documents`, `#contact`, `#blog`, and `#settings`. Projects retain their original IDs, including `#nselivescanner` for Stock Scanner.

Use arrows in the main menu and library, Enter to open the focused link, and Escape to return to a project's library or a page's main menu. Tab reaches all utility links and content controls. The Back link follows that same hierarchy; browser Back and Forward traverse actual visit history.

Settings offers Midnight, Evergreen, and Graphite themes. Only the selected theme is saved under `aayan-portfolio-preferences-v2`. The old classic appearance migrates to Graphite, and the old console appearance to Midnight. Corrupted or unavailable storage falls back safely to Midnight. Restore Defaults selects Midnight. No sound is played.

## Source structure

- `src/App.tsx`: application shell, route subscription, focus management, and page composition.
- `src/navigation.ts`: section definitions, hash routing, and geometric keyboard selection.
- `src/components/`: bitmap icons, selectable menus, project covers, headings, and content links.
- `src/pages/`: Home, Projects/Research, project details, professional pages, and Settings.
- `src/preferences.ts`: validated local theme preferences and migration.
- `src/styles/console.css`: console shell, menu, library, document, responsive, and print styles.

The retired Windows desktop components and styles are removed. All local assets, `references/`, and `windows2000/` are preserved.

## Blog and newsletter foundation

Add entries only to the inline `blogPosts` array in `src/content.ts`, using `blogPost(slug, title, options)`. Supported options are `publicationDate` (YYYY-MM-DD), optional `cover`, `excerpt`, `content` (plain text with blank lines between paragraphs), `tags` (string array), and `status` (`draft` or `published`). Posts default to draft. Published entries require a title, valid date, and article content.

Use literal strings and inline option objects, with an explicit literal `status: "published"` to publish. Keep slugs unique and use lowercase words separated by hyphens. The Blog directory lists published posts newest first. Individual posts use `#blog/your-slug`, with Back and Escape returning to Blog. No sample posts are supplied.

The `build/public-blog.ts` Vite plugin removes draft calls, including their titles, excerpts, and text, before content is served or bundled. It rejects dynamic entries, option spreads, and duplicate slugs rather than risk exposing draft data. Production source maps are disabled to avoid including the unredacted source. Do not bypass this plugin when publishing; deploy `dist/`, not the source checkout.

The Newsletter component is an inactive placeholder. It has no form, email collection, storage, provider, or delivery behavior. Replace `src/components/Newsletter.tsx` when a real provider is connected.

## Project explanation modes

Use `project(..., { simple: { ... }, technical: { ... } })` in `src/content.ts` to write both presentations. Both accept long, multi-paragraph text. Empty fields are hidden.

Simple is the complete project story for someone with no computing background, not a short summary or a list of specifications. Populate `whatItIs`, `whyItExists`, `whatItDoes`, `howItWorks`, `accomplishments`, `challenges`, and `plannedWork`. Explain necessary terminology in ordinary language. Describe only verified work and results.

For Nerds is deeper documentation. Populate `architecture`, `implementation`, `algorithms`, `interfaces`, `tradeOffs`, `testing`, `limitations`, `researchFindings`, and `plannedWork` where applicable. Include concrete engineering decisions, reasoning, validation, and evidence in these narratives. Existing `description`, `sections`, `subtitle`, `technologies`, and `documentation` remain supported in the technical view; they are not used as a Simple fallback.

The custom confirmation dialog opens before entering For Nerds, with Never mind focused first. Tab remains within the dialog; arrow keys move between its buttons; Escape cancels without navigating away. Cancel restores focus to the trigger. Confirmation focuses the new technical heading. The visible Okay, back to English control restores the Simple presentation. Existing project records remain empty until verified narratives are supplied.

## Personal interest pages

About links to `#music`, `#aviation`, and `#motorsport`, using the existing header Back control to return to About. These pages are not added to the homepage menu and do not use project explanation modes.

Edit `about.interests` in `src/content.ts` with the existing `interest(id, title, summary, options)` helper. The summary appears on About. Options include `introduction` (defaults to summary), `background`, `activities` (sections), `sections` (custom sections), `notes` (additional sections), `images`, and `links`. Use `section()`, `image("assets/your-photo.jpg", "caption")`, and `link()` as needed. Empty content is hidden. No stock media or invented personal experiences are supplied.

The old About-only technical and personal-interest disclosures have been removed. Optional capability technical notes are displayed inline. The separate project-level For Nerds confirmation and documentation system remains unchanged.
