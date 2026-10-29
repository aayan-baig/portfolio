const ICONS = {
  computer: "My Computer",
  internet: "The Internet",
  documents: "My Documents",
  document: "Default Document",
  text: "Text Document",
  folder: "Closed Folder",
  folderOpen: "Open Folder",
  programs: "Programs",
  settings: "Control Panel",
  network: "Network Neighborhood",
  search: "Find",
  help: "Help",
  drive: "Hard Drive",
  image: "Bitmap Image",
  audio: "Wave Sound",
  video: "Video Clip",
  recycleBin: "Recycle Bin (empty)",
} as const;

export type IconName = keyof typeof ICONS;

export function assetPath(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

export function iconPath(name: IconName): string {
  return assetPath(`assets/icons/${encodeURIComponent(`Windows 2000 ${ICONS[name]}.ico`)}`);
}
