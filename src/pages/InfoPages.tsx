import { achievements, documents, educationHistory, experiences, profile } from "../content";
import PageHeading from "../components/PageHeading";
import ContentLinks from "../components/ContentLinks";

export { default as AboutPage } from "./AboutPage";

export function ExperiencePage() {
  return <>
    <PageHeading title="Experience" icon="programs" />
    {experiences.length === 0 && <p className="empty-note">No public entries.</p>}
    {experiences.map((item) => <section className="reading-panel" key={item.id}>
      {item.role && <h2>{item.role}</h2>}
      {item.organization && <p className="entry-organization">{item.organization}</p>}
      {item.period && <p className="entry-period">{item.period}</p>}
      {item.description && <p>{item.description}</p>}
      {item.highlights.filter(Boolean).length > 0 && <ul>{item.highlights.filter(Boolean).map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
    </section>)}
  </>;
}

export function EducationPage() {
  return <>
    <PageHeading title="Education" icon="documents" />
    {educationHistory.length === 0 && <p className="empty-note">No public entries.</p>}
    {educationHistory.map((item, index) => <section className="reading-panel" key={`${item.institution}-${index}`}>
      {item.institution && <h2>{item.institution}</h2>}
      {item.qualification && <p className="entry-organization">{item.qualification}</p>}
      {item.period && <p className="entry-period">{item.period}</p>}
      {item.details.filter(Boolean).length > 0 && <ul>{item.details.filter(Boolean).map((detail) => <li key={detail}>{detail}</li>)}</ul>}
    </section>)}
  </>;
}

export function AchievementsPage() {
  return <>
    <PageHeading title="Achievements" icon="folderOpen" />
    {achievements.length === 0 && <p className="empty-note">No public entries.</p>}
    {achievements.map((item, index) => <section className="reading-panel" key={`${item.title}-${index}`}>
      {item.title && <h2>{item.title}</h2>}
      {item.organization && <p className="entry-organization">{item.organization}</p>}
      {item.year && <p className="entry-period">{item.year}</p>}
      {item.description && <p>{item.description}</p>}
    </section>)}
  </>;
}

export function DocumentsPage() {
  return <>
    <PageHeading title="Documents" icon="document" />
    {documents.some((item) => item.url.trim()) ? <section className="reading-panel"><ContentLinks items={documents} documents /></section> : <p className="empty-note">No public documents.</p>}
  </>;
}

export function ContactPage() {
  return <>
    <PageHeading title="Contact" icon="internet" />
    {(profile.email || profile.links.some((item) => item.url.trim())) ? <section className="reading-panel">
      {profile.email && <p><strong>Email:</strong> <a href={`mailto:${profile.email}`}>{profile.email}</a></p>}
      <ContentLinks items={profile.links} />
    </section> : <p className="empty-note">No contact details published.</p>}
  </>;
}
