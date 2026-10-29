import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { findPublishedPost } from "./blog";
import { BlogPage, BlogPostPage } from "./pages/BlogPage";
import { about, profile, projects } from "./content";
import { PAGES, currentRoute, hrefFor, parentRoute, routeTitle, subscribeRoute } from "./navigation";
import { DEFAULT_PREFERENCES, loadPreferences, savePreferences } from "./preferences";
import RetroIcon from "./components/RetroIcon";
import PageHeading from "./components/PageHeading";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";
import SettingsPage from "./pages/SettingsPage";
import InterestPage from "./pages/InterestPage";
import { AboutPage, ExperiencePage, EducationPage, AchievementsPage, DocumentsPage, ContactPage } from "./pages/InfoPages";

export default function App() {
  const route = useSyncExternalStore(subscribeRoute, currentRoute, () => "home");
  const [preferences, setPreferences] = useState(loadPreferences);
  const contentRef = useRef<HTMLElement>(null);
  const project = projects.find((item) => item.id === route);
  const post = findPublishedPost(route);
  const interest = about.interests.find((item) => item.id === route);
  const title = routeTitle(route);
  const parent = parentRoute(route);

  useEffect(() => savePreferences(preferences), [preferences]);

  useEffect(() => {
    document.title = route === "home" ? `${profile.name} | My Portfolio` : `${title} | ${profile.name}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", profile.bio || profile.name);
    const firstChoice = contentRef.current?.querySelector<HTMLAnchorElement>('[data-menu-item][data-selected="true"]');
    (firstChoice ?? contentRef.current)?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [route, title]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (event.key !== "Escape" || event.defaultPrevented || route === "home") return;
      if (target instanceof HTMLElement && (target.matches("input, select, textarea") || target.isContentEditable)) return;
      window.location.hash = hrefFor(parent);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [parent, route]);

  function renderPage() {
    if (project) return <ProjectPage project={project} />;
    if (post) return <BlogPostPage post={post} />;
    if (interest) return <InterestPage interest={interest} />;
    switch (route) {
      case "home": return <HomePage />;
      case "projects": return <ProjectsPage />;
      case "research": return <ProjectsPage researchOnly />;
      case "about": return <AboutPage />;
      case "experience": return <ExperiencePage />;
      case "education": return <EducationPage />;
      case "achievements": return <AchievementsPage />;
      case "documents": return <DocumentsPage />;
      case "contact": return <ContactPage />;
      case "blog": return <BlogPage />;
      case "settings": return <SettingsPage preferences={preferences} onChange={setPreferences} onReset={() => setPreferences({ ...DEFAULT_PREFERENCES })} />;
      default: return <><PageHeading title="Page not found" icon="help" /><p className="empty-note">This address does not match a page or project. <a href="#home">Return to the main menu.</a></p></>;
    }
  }

  return (
    <div className="console-site" data-theme={preferences.theme}>
      <a className="skip-link" href="#main-content" onClick={(event) => { event.preventDefault(); contentRef.current?.focus(); }}>Skip to content</a>
      <div className="site-frame">
        <header className="site-header">
          {route === "home" ? (
            <div className="site-identity"><RetroIcon name="computer" size={32} /><span><strong>{profile.name}</strong><small>My Portfolio</small></span></div>
          ) : (
            <a className="site-identity" href="#home"><RetroIcon name="computer" size={32} /><span><strong>{profile.name}</strong><small>My Portfolio</small></span></a>
          )}
          <nav className="header-controls" aria-label="Utility navigation">
            {route !== "home" && <a className="bevel-button" href={hrefFor(parent)}><span aria-hidden="true">&lt;</span> {interest ? "Back to About" : "Back"}</a>}
            <a className="bevel-button" href="#home" aria-current={route === "home" ? "page" : undefined}>Home</a>
            <a className="bevel-button settings-link" href="#settings" aria-current={route === "settings" ? "page" : undefined}><RetroIcon name="settings" size={18} /><span>Settings</span></a>
          </nav>
        </header>
        <div className="screen-bar"><span aria-live="polite">{route === "home" ? "MAIN MENU" : `DIRECTORY / ${title}`}</span><span>{String(projects.length).padStart(2, "0")} PROJECTS</span></div>
        <div className={`screen-body ${route === "home" ? "screen-home" : "screen-page"}`}>
          {route !== "home" && <nav className="section-directory" aria-label="Portfolio sections">
            <h2>Directory</h2>
            {PAGES.map((page) => <a href={hrefFor(page.id)} key={page.id} aria-current={page.id === route || (project && page.id === "projects") || (post && page.id === "blog") || (interest && page.id === "about") ? "page" : undefined}><RetroIcon name={page.icon} size={18} /><span>{page.title}</span></a>)}
          </nav>}
          <main ref={contentRef} id="main-content" tabIndex={-1} key={route}>{renderPage()}</main>
        </div>
        <footer className="site-footer"><span>{profile.name}</span><span><kbd>Tab</kbd> Navigate <kbd>Enter</kbd> Open <kbd>Esc</kbd> Back</span></footer>
      </div>
    </div>
  );
}
