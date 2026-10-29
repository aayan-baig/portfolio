import { useEffect, useId, useRef, useState } from "react";
import { ageOnDate } from "../about";

export default function BirthdayAge({ birthDate, message }: { birthDate: string; message: string }) {
  const [now, setNow] = useState(() => new Date());
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const controlRef = useRef<HTMLSpanElement>(null);
  const age = ageOnDate(birthDate, now);

  useEffect(() => {
    const refresh = () => setNow(new Date());
    const interval = window.setInterval(refresh, 60_000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
      }
    };
    const onOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !controlRef.current?.contains(event.target)) setOpen(false);
    };
    window.addEventListener("keydown", onEscape, true);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      window.removeEventListener("keydown", onEscape, true);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [open]);

  if (age === null) return null;
  return (
    <span
      ref={controlRef}
      className="birthday-control"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement)) setOpen(false);
      }}
    >
      <button
        type="button"
        className="birthday-age"
        aria-describedby={tooltipId}
        aria-expanded={open}
        aria-controls={tooltipId}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(true)}
      >
        {age}<span className="about-sr-only"> years old; show birthday</span>
      </button>
      <span id={tooltipId} role="tooltip" className="birthday-tip" hidden={!open}>{message}</span>
    </span>
  );
}
