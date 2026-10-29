import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { directionalIndex, hrefFor } from "../navigation";

type MenuItem = { id: string; label: string; content: ReactNode };
type SelectionMenuProps = { items: MenuItem[]; label: string; className: string };

export default function SelectionMenu({ items, label, className }: SelectionMenuProps) {
  const [selected, setSelected] = useState(items[0]?.id);
  const menuRef = useRef<HTMLDivElement>(null);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!event.key.startsWith("Arrow") && event.key !== "Home" && event.key !== "End") return;
    const anchors = Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>("[data-menu-item]") ?? []);
    const current = anchors.findIndex((anchor) => anchor === document.activeElement);
    if (current < 0) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? anchors.length - 1
      : directionalIndex(anchors.map((anchor) => anchor.getBoundingClientRect()), current, event.key);
    anchors[next]?.focus();
  }

  if (!items.length) return null;
  return (
    <nav aria-label={label} className="selection-menu">
      <div className={className} ref={menuRef} onKeyDown={onKeyDown}>
        {items.map((item) => (
          <a
            key={item.id}
            href={hrefFor(item.id)}
            className={`menu-choice choice-${item.id}`}
            data-menu-item=""
            data-selected={selected === item.id}
            tabIndex={selected === item.id ? 0 : -1}
            aria-label={item.label}
            onFocus={() => setSelected(item.id)}
            onMouseEnter={() => setSelected(item.id)}
          >
            {item.content}
          </a>
        ))}
      </div>
      <div className="menu-readout">
        <span><span className="selection-pointer" aria-hidden="true" />{items.find((item) => item.id === selected)?.label}</span>
        <span className="keyboard-hint"><kbd>Arrows</kbd> Select <kbd>Enter</kbd> Open</span>
      </div>
    </nav>
  );
}
