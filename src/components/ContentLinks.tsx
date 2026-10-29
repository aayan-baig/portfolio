import type { Link } from "../content";
import RetroIcon from "./RetroIcon";

export default function ContentLinks({ items, documents = false }: { items: Link[]; documents?: boolean }) {
  const links = items.filter((item) => item.url.trim());
  if (!links.length) return null;
  return (
    <ul className="content-links">
      {links.map((item, index) => (
        <li key={`${item.url}-${index}`}>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            <RetroIcon name={documents ? "document" : "internet"} size={20} />
            <span>{item.label || item.url}</span><span className="external-indicator" aria-label="opens in a new tab">[ext]</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
