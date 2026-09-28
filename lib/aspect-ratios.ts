/**
 * Aspect ratios offered by the image crop modal. Presets are built in;
 * custom ratios are created by admins and stored on SiteSettings.
 */
export type AspectRatioOption = {
  id: string;
  label: string;
  width: number;
  height: number;
};

export const ASPECT_RATIO_PRESETS: AspectRatioOption[] = [
  { id: "1:1", label: "Square", width: 1, height: 1 },
  { id: "4:5", label: "Portrait", width: 4, height: 5 },
  { id: "3:4", label: "Portrait", width: 3, height: 4 },
  { id: "2:3", label: "Portrait", width: 2, height: 3 },
  { id: "9:16", label: "Story", width: 9, height: 16 },
  { id: "5:4", label: "Landscape", width: 5, height: 4 },
  { id: "4:3", label: "Landscape", width: 4, height: 3 },
  { id: "3:2", label: "Landscape", width: 3, height: 2 },
  { id: "16:9", label: "Widescreen", width: 16, height: 9 },
  { id: "21:9", label: "Cinema", width: 21, height: 9 },
  { id: "3:1", label: "Banner", width: 3, height: 1 },
];

export const MAX_ASPECT_SIDE = 10000;

export function ratioText(width: number, height: number) {
  return `${formatSide(width)}:${formatSide(height)}`;
}

function formatSide(n: number) {
  return Number.isInteger(n) ? String(n) : String(Number(n.toFixed(2)));
}

/** True when two aspect values are close enough to be treated as equal. */
export function sameAspect(a: number, b: number) {
  return Math.abs(a - b) < 0.001;
}
