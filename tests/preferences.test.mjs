import assert from "node:assert/strict";
import { after, test } from "node:test";
import { DEFAULT_PREFERENCES, PREFERENCES_KEY, loadPreferences, savePreferences } from "../src/preferences.ts";

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
function useStorage(value, legacy) {
  const values = new Map();
  if (value !== undefined) values.set(PREFERENCES_KEY, value);
  if (legacy !== undefined) values.set("aayan-portfolio-preferences-v1", legacy);
  globalThis.window = { localStorage: {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, next) => values.set(key, next),
  } };
  return values;
}
after(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else delete globalThis.window;
});

test("new visitors receive the midnight console theme", () => {
  useStorage();
  assert.deepEqual(loadPreferences(), { theme: "midnight" });
  assert.notEqual(loadPreferences(), DEFAULT_PREFERENCES);
});
test("all supported themes persist using the versioned local key", () => {
  const values = useStorage();
  for (const theme of ["midnight", "evergreen", "graphite"]) {
    savePreferences({ theme });
    assert.deepEqual(loadPreferences(), { theme });
  }
  assert.deepEqual([...values.keys()], ["aayan-portfolio-preferences-v2"]);
});
test("corrupted, invalid, and obsolete fields cannot inject a theme", () => {
  for (const value of ["broken", "null", "[]", "42", '{}', '{"theme":"purple"}', '{"theme":false}', '{"theme":"url(https://example.invalid)"}']) {
    useStorage(value);
    assert.deepEqual(loadPreferences(), DEFAULT_PREFERENCES);
  }
});
test("old classic and console preferences migrate without desktop state", () => {
  useStorage(undefined, JSON.stringify({ appearance: "classic", wallpaperEnabled: true, volume: 40 }));
  assert.deepEqual(loadPreferences(), { theme: "graphite" });
  useStorage(undefined, JSON.stringify({ appearance: "console", activeDesktop: true }));
  assert.deepEqual(loadPreferences(), { theme: "midnight" });
});
test("version 2 choices take precedence over the old appearance", () => {
  useStorage('{"theme":"evergreen"}', '{"appearance":"classic"}');
  assert.deepEqual(loadPreferences(), { theme: "evergreen" });
});
test("storage denial or quota errors do not prevent rendering", () => {
  globalThis.window = {};
  Object.defineProperty(window, "localStorage", { get() { throw new Error("Storage denied"); } });
  assert.deepEqual(loadPreferences(), DEFAULT_PREFERENCES);
  assert.doesNotThrow(() => savePreferences({ ...DEFAULT_PREFERENCES }));
  globalThis.window = { localStorage: { getItem() { throw new Error("Read denied"); }, setItem() { throw new Error("Quota"); } } };
  assert.deepEqual(loadPreferences(), DEFAULT_PREFERENCES);
  assert.doesNotThrow(() => savePreferences({ ...DEFAULT_PREFERENCES }));
});
test("restore defaults replaces the saved theme", () => {
  useStorage();
  savePreferences({ theme: "evergreen" });
  savePreferences({ ...DEFAULT_PREFERENCES });
  assert.deepEqual(loadPreferences(), DEFAULT_PREFERENCES);
});
