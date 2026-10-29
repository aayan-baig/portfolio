import type { ReactNode } from "react";
import RetroIcon from "./RetroIcon";
import type { IconName } from "../icons";

export default function PageHeading({ title, icon, children }: { title: string; icon: IconName; children?: ReactNode }) {
  return (
    <header className="page-heading">
      <RetroIcon name={icon} size={32} />
      <div><h1>{title}</h1>{children}</div>
    </header>
  );
}
