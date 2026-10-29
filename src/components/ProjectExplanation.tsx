import type { Project, Section, SimpleProjectExplanation, TechnicalProjectExplanation } from "../content";
import ContentLinks from "./ContentLinks";

const SIMPLE_FIELDS: [keyof SimpleProjectExplanation, string][] = [
  ["whatItIs", "What is it?"],
  ["whyItExists", "Why it exists"],
  ["whatItDoes", "What it does"],
  ["howItWorks", "How it works"],
  ["accomplishments", "What has been accomplished"],
  ["challenges", "Challenges along the way"],
  ["plannedWork", "What is planned"],
];
const TECHNICAL_FIELDS: [keyof TechnicalProjectExplanation, string][] = [
  ["architecture", "Architecture"],
  ["implementation", "Implementation"],
  ["algorithms", "Algorithms"],
  ["interfaces", "Interfaces"],
  ["tradeOffs", "Engineering trade-offs"],
  ["testing", "Testing & validation"],
  ["limitations", "Limitations"],
  ["researchFindings", "Research findings"],
  ["plannedWork", "Planned technical work"],
];

function NarrativeSections({ sections }: { sections: Section[] }) {
  return sections.filter((item) => item.text.trim()).map((item, index) => (
    <section className="reading-panel" key={`${item.title}-${index}`}>
      {item.title && <h3>{item.title}</h3>}
      {item.text.split(/\n\s*\n/).filter((text) => text.trim()).map((text, paragraph) => <p key={paragraph}>{text}</p>)}
    </section>
  ));
}

export default function ProjectExplanation({ project, mode }: { project: Project; mode: "simple" | "technical" }) {
  if (mode === "simple") {
    const sections = SIMPLE_FIELDS.map(([field, title]) => ({ title, text: project.simple[field] }));
    return sections.some((item) => item.text.trim()) ? <NarrativeSections sections={sections} />
      : <p className="empty-note">A plain-language explanation has not been published for this project.</p>;
  }

  const sections: Section[] = [
    ...(project.description ? [{ title: "Overview", text: project.description }] : []),
    ...TECHNICAL_FIELDS.map(([field, title]) => ({ title, text: project.technical[field] })),
    ...project.sections,
  ];
  const hasDocumentation = project.documentation.some((item) => item.url.trim());
  return <>
    {project.subtitle && <p className="project-technical-subtitle">{project.subtitle}</p>}
    {!sections.some((item) => item.text.trim()) && !hasDocumentation && <p className="empty-note">Technical documentation has not been published for this project.</p>}
    <NarrativeSections sections={sections} />
    {hasDocumentation && <section className="reading-panel"><h3>Documentation</h3><ContentLinks items={project.documentation} documents /></section>}
  </>;
}
