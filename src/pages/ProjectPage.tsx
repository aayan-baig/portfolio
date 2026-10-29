import { useEffect, useRef, useState } from "react";
import type { Project } from "../content";
import { projects } from "../content";
import { assetPath } from "../icons";
import { hrefFor } from "../navigation";
import PageHeading from "../components/PageHeading";
import ProjectCover from "../components/ProjectCover";
import ContentLinks from "../components/ContentLinks";
import ProjectExplanation from "../components/ProjectExplanation";
import TechnicalConfirmation from "../components/TechnicalConfirmation";

export default function ProjectPage({ project }: { project: Project }) {
  const [mode, setMode] = useState<"simple" | "technical">("simple");
  const [confirming, setConfirming] = useState(false);
  const modeHeading = useRef<HTMLHeadingElement>(null);
  const previousMode = useRef(mode);
  useEffect(() => {
    if (previousMode.current !== mode) modeHeading.current?.focus({ preventScroll: true });
    previousMode.current = mode;
  }, [mode]);
  const images = project.images.filter((image) => image.src.trim());
  return (
    <article>
      <PageHeading title={project.title} icon="folderOpen" />
      <div className="project-detail">
        <aside className="project-record" aria-label="Project information">
          <ProjectCover key={project.cover} project={project} />
          {project.status && <p><strong>Status:</strong> {project.status}</p>}
          {mode === "technical" && project.technologies.filter(Boolean).length > 0 && <section>
            <h2>Technologies</h2>
            <ul className="technology-list">{project.technologies.filter(Boolean).map((tech) => <li key={tech}>{tech}</li>)}</ul>
          </section>}
          <nav className="project-index" aria-label="Other projects">
            <h2>Project index</h2>
            {projects.map((item) => <a key={item.id} href={hrefFor(item.id)} aria-current={item.id === project.id ? "page" : undefined}>{item.title}</a>)}
          </nav>
        </aside>
        <div className="project-document">
          <div className="project-mode-controls">
            <h2 ref={modeHeading} tabIndex={-1}>{mode === "simple" ? "Simple" : "For Nerds"}</h2>
            {mode === "simple" ? (
              <button type="button" className="bevel-button" onClick={(event) => { event.currentTarget.focus(); setConfirming(true); }}>For Nerds</button>
            ) : (
              <button type="button" className="bevel-button" onClick={() => setMode("simple")}>Okay, back to English</button>
            )}
          </div>
          <div className="project-explanation">
            <ProjectExplanation project={project} mode={mode} />
          </div>
          {images.length > 0 && <section className="reading-panel"><h2>Screenshots & media</h2>
            <div className="media-gallery">{images.map((image, index) => <figure key={`${image.src}-${index}`}>
              <a href={assetPath(image.src)} target="_blank" rel="noopener noreferrer"><img src={assetPath(image.src)} alt={image.caption || `${project.title} screenshot ${index + 1}`} loading="lazy" /></a>
              {image.caption && <figcaption>{image.caption}</figcaption>}
            </figure>)}</div>
          </section>}
          {project.links.some((item) => item.url.trim()) && <section className="reading-panel"><h2>External links</h2><ContentLinks items={project.links} /></section>}
        </div>
      </div>
      {confirming && <TechnicalConfirmation
        onDismiss={() => setConfirming(false)}
        onConfirm={() => { setConfirming(false); setMode("technical"); }}
      />}
    </article>
  );
}
