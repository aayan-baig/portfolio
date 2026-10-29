import type { PersonalInterest, Section } from "../content";
import { assetPath } from "../icons";
import ContentLinks from "../components/ContentLinks";
import PageHeading from "../components/PageHeading";

function Paragraphs({ text }: { text: string }) {
  return text.split(/\n\s*\n/).filter((paragraph) => paragraph.trim()).map((paragraph, index) => <p key={index}>{paragraph}</p>);
}

function Notes({ title, items }: { title: string; items: Section[] }) {
  const sections = items.filter((item) => item.text.trim());
  if (!sections.length) return null;
  return (
    <section className="reading-panel">
      <h2>{title}</h2>
      {sections.map((item, index) => <div key={`${item.title}-${index}`}>
        {item.title && <h3>{item.title}</h3>}
        <Paragraphs text={item.text} />
      </div>)}
    </section>
  );
}

export default function InterestPage({ interest }: { interest: PersonalInterest }) {
  const images = interest.images.filter((item) => item.src.trim());
  return (
    <article>
      <PageHeading title={interest.title} icon={interest.icon ?? "document"} />
      {interest.introduction.trim() && <section className="reading-panel"><Paragraphs text={interest.introduction} /></section>}
      {interest.background.trim() && <section className="reading-panel"><h2>Personal background</h2><Paragraphs text={interest.background} /></section>}
      <Notes title="Activities & experience" items={interest.activities} />
      {interest.sections.filter((item) => item.text.trim()).map((item, index) => <section className="reading-panel" key={`${item.title}-${index}`}>
        {item.title && <h2>{item.title}</h2>}
        <Paragraphs text={item.text} />
      </section>)}
      {images.length > 0 && <section className="reading-panel">
        <h2>Photographs & media</h2>
        <div className="media-gallery">{images.map((item, index) => <figure key={`${item.src}-${index}`}>
          <img src={assetPath(item.src)} alt={item.caption} loading="lazy" />
          {item.caption && <figcaption>{item.caption}</figcaption>}
        </figure>)}</div>
      </section>}
      {interest.links.some((item) => item.url.trim()) && <section className="reading-panel"><h2>Links</h2><ContentLinks items={interest.links} /></section>}
      <Notes title="Additional notes" items={interest.notes} />
    </article>
  );
}
