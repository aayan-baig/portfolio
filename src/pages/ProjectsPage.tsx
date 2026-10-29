import { projects, research, type Project } from "../content";
import PageHeading from "../components/PageHeading";
import ProjectCover from "../components/ProjectCover";
import SelectionMenu from "../components/SelectionMenu";

export default function ProjectsPage({ researchOnly = false }: { researchOnly?: boolean }) {
  const entries: Project[] = researchOnly ? research : projects;
  return (
    <>
      <PageHeading title={researchOnly ? "Research" : "Projects"} icon={researchOnly ? "text" : "folder"}>
        <p>{entries.length} {entries.length === 1 ? "entry" : "entries"}</p>
      </PageHeading>
      {entries.length > 0 ? (
        <SelectionMenu label={researchOnly ? "Research library" : "Project library"} className="project-library" items={entries.map((project) => ({
          id: project.id,
          label: project.title,
          content: <>
            <ProjectCover project={project} />
            <div className="project-card-copy">
              <h2>{project.title}</h2>
              {project.subtitle && <p>{project.subtitle}</p>}
              {project.description && <p className="project-summary">{project.description}</p>}
              {project.status && <span className="project-status">{project.status}</span>}
            </div>
          </>,
        }))} />
      ) : <p className="empty-note">No public entries.</p>}
    </>
  );
}
