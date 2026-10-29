import { useState } from "react";
import type { Project } from "../content";
import { assetPath } from "../icons";
import RetroIcon from "./RetroIcon";

export default function ProjectCover({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="project-cover">
      {project.cover && !failed ? (
        <img src={assetPath(project.cover)} alt={`${project.title} cover`} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="project-cover-fallback" aria-label={`${project.title}, no cover artwork`}>
          <RetroIcon name="folder" size={48} />
          <span>{project.title}</span>
        </div>
      )}
    </div>
  );
}
