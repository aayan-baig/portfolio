import type { Preferences, Theme } from "../preferences";
import PageHeading from "../components/PageHeading";

const THEMES: { id: Theme; label: string }[] = [
  { id: "midnight", label: "Midnight" },
  { id: "evergreen", label: "Evergreen" },
  { id: "graphite", label: "Graphite" },
];

export default function SettingsPage({ preferences, onChange, onReset }: {
  preferences: Preferences;
  onChange: (preferences: Preferences) => void;
  onReset: () => void;
}) {
  return <>
    <PageHeading title="Settings" icon="settings" />
    <section className="reading-panel settings-panel">
      <fieldset>
        <legend>Color theme</legend>
        <div className="theme-options">{THEMES.map((theme) => <label key={theme.id} className="theme-option">
          <span className={`theme-swatch swatch-${theme.id}`} aria-hidden="true"><span /><span /><span /></span>
          <span><input type="radio" name="theme" value={theme.id} checked={preferences.theme === theme.id} onChange={() => onChange({ theme: theme.id })} /> {theme.label}</span>
        </label>)}</div>
      </fieldset>
      <p className="settings-note">Your choice is saved in this browser. No data is sent to a server.</p>
      <button className="bevel-button" onClick={onReset}>Restore Defaults</button>
    </section>
  </>;
}
