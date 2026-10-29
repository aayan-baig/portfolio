import { useState } from "react";
import { about, profile, projects, type Section } from "../content";
import { birthdayLabel } from "../about";
import { assetPath } from "../icons";
import { hrefFor } from "../navigation";
import PageHeading from "../components/PageHeading";
import RetroIcon from "../components/RetroIcon";
import BirthdayAge from "../components/BirthdayAge";
import ContentLinks from "../components/ContentLinks";

function Notes({ items }: { items: Section[] }) {
  return items.filter((item) => item.title || item.text).map((item, index) => (
    <div className="about-note" key={`${item.title}-${index}`}>
      {item.title && <h4>{item.title}</h4>}
      {item.text && <p>{item.text}</p>}
    </div>
  ));
}

function Paragraphs({ text, includeAge = false }: { text: string; includeAge?: boolean }) {
  const birthday = birthdayLabel(profile.birthDate);
  return text.split(/\n\s*\n/).filter((paragraph) => paragraph.trim()).map((paragraph, index) => (
    <p key={index}>
      {includeAge ? paragraph.split("{age}").map((part, partIndex, parts) => (
        <span key={partIndex}>{part}{partIndex < parts.length - 1 && (
          <BirthdayAge birthDate={profile.birthDate} message={about.birthdayWish.replace("{birthday}", birthday)} />
        )}</span>
      )) : paragraph}
    </p>
  ));
}

function Portrait() {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="about-portrait">
      {about.portrait.src && !failed ? (
        <img src={assetPath(about.portrait.src)} alt={about.portrait.caption || profile.name} onError={() => setFailed(true)} />
      ) : (
        <div className="about-portrait-placeholder" role="img" aria-label={about.portraitPlaceholder}>
          <RetroIcon name="image" size={48} />
          <span aria-hidden="true">{about.portraitPlaceholder}</span>
        </div>
      )}
      <figcaption>{about.portrait.caption || about.portraitLabel}</figcaption>
    </figure>
  );
}

export default function AboutPage() {
  const birthday = birthdayLabel(profile.birthDate);
  return (
    <div className="about-page">
      <PageHeading title="About" icon="computer" />
      <section className="reading-panel about-introduction" aria-labelledby="about-greeting">
        <div className="about-intro-copy">
          <h2 id="about-greeting">{about.greeting}</h2>
          {profile.title && <p>{profile.title}</p>}
          {about.introduction && <Paragraphs text={about.introduction} includeAge />}
          <dl className="about-facts">
            {profile.location && <div><dt>Based in</dt><dd>{profile.location}</dd></div>}
            {birthday && <>
              <div><dt>Birthday</dt><dd><time dateTime={profile.birthDate}>{birthdayLabel(profile.birthDate, true)}</time></dd></div>
            </>}
            {profile.programmingSince && <div><dt>Programming since</dt><dd>{profile.programmingSince}</dd></div>}
          </dl>
        </div>
        <Portrait key={about.portrait.src} />
      </section>

      {(about.history.title || about.history.text) && (
        <section className="reading-panel">
          {about.history.title && <h2>{about.history.title}</h2>}
          {about.history.text && <Paragraphs text={about.history.text} />}
        </section>
      )}

      {about.capabilities.length > 0 && (
        <section className="reading-panel" aria-labelledby="about-capabilities-heading">
          <h2 id="about-capabilities-heading">{about.capabilitiesTitle}</h2>
          {about.capabilitiesIntroduction && <p>{about.capabilitiesIntroduction}</p>}
          <div className="about-capabilities">
            {about.capabilities.map((item) => {
              const supportingProjects = item.projectIds.flatMap((id) => projects.filter((project) => project.id === id));
              return (
                <section className="about-capability" key={item.id}>
                  <h3>{item.icon && <RetroIcon name={item.icon} size={20} />}{item.name}</h3>
                  {item.description && <p>{item.description}</p>}
                  {item.skills.filter(Boolean).length > 0 && <p className="about-skill-inventory"><strong>Technologies & skills:</strong> {item.skills.filter(Boolean).join(", ")}</p>}
                  {item.experienceLevel && <p><strong>Experience:</strong> {item.experienceLevel}</p>}
                  {supportingProjects.length > 0 && <nav className="about-project-links" aria-label={`${item.name}: supporting projects`}>
                    <span>Related work:</span>
                    {supportingProjects.map((project) => <a key={project.id} href={hrefFor(project.id)}>{project.title}</a>)}
                  </nav>}
                  {item.technicalNotes.some((note) => note.title || note.text) && <Notes items={item.technicalNotes} />}
                </section>
              );
            })}
          </div>

        </section>
      )}

      {about.interests.length > 0 && (
        <section className="reading-panel" aria-labelledby="about-outside-heading">
          <h2 id="about-outside-heading">{about.outsideTitle}</h2>
          {about.interests.map((item) => <section className="about-interest" key={item.id}>
            <h3>{item.icon && <RetroIcon name={item.icon} size={20} />}{item.title}</h3>
            {item.summary && <p>{item.summary}</p>}
            <a href={hrefFor(item.id)}>Explore {item.title}</a>
          </section>)}
        </section>
      )}

      {profile.interests.filter(Boolean).length > 0 && <section className="reading-panel">
        <h2>{about.additionalInterestsTitle}</h2>
        <ul>{profile.interests.filter(Boolean).map((item) => <li key={item}>{item}</li>)}</ul>
      </section>}
      {profile.links.some((item) => item.url.trim()) && <section className="reading-panel"><h2>Elsewhere</h2><ContentLinks items={profile.links} /></section>}
      {(about.closing.title || about.closing.text) && <section className="reading-panel">
        {about.closing.title && <h2>{about.closing.title}</h2>}
        {about.closing.text && <p>{about.closing.text}</p>}
      </section>}
    </div>
  );
}
