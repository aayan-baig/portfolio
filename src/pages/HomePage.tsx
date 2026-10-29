import { profile, projects } from "../content";
import { PAGES, hrefFor } from "../navigation";
import RetroIcon from "../components/RetroIcon";
import SelectionMenu from "../components/SelectionMenu";

export default function HomePage() {
  return (
    <div className="home-screen">
      <section className="welcome-panel">
        <div className="panel-label"><RetroIcon name="internet" size={16} /> Welcome</div>
        <h1>{profile.welcome}</h1>
        {profile.title && <p>{profile.title}</p>}
        <p className="welcome-instruction">Select a section to look around.</p>
        <div className="mini-directory">
          <h2>In the library <span>{String(projects.length).padStart(2, "0")}</span></h2>
          <ul>{projects.map((project) => <li key={project.id}><a href={hrefFor(project.id)}>{project.title}</a></li>)}</ul>
        </div>
      </section>
      <section className="main-menu-panel" aria-labelledby="menu-heading">
        <div className="menu-caption"><h2 id="menu-heading">Main menu</h2><span>Choose a section</span></div>
        <SelectionMenu
          label="Main menu"
          className="console-menu"
          items={PAGES.map((page) => ({
            id: page.id,
            label: page.title,
            content: <>
              <RetroIcon name={page.icon} size={page.id === "projects" ? 64 : page.id === "research" ? 40 : 32} />
              <strong>{page.title}</strong>
              {page.id === "projects" && <span className="tile-detail">{projects.length} projects in the library</span>}
            </>,
          }))}
        />
      </section>
    </div>
  );
}
