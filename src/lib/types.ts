/**
 * The shape of the crime scene content files under `public/scenes/`.
 *
 * Everything a student sees comes from these files, so adding a new crime scene
 * never means changing any code. See README.md for a walkthrough.
 */

/** The kinds of container a student can pick. Defined in `containers.json`. */
export type PackageId = string;

export interface Container {
  /** e.g. "Paper evidence bag" */
  label: string;
  /** A small symbol shown beside the label. */
  icon: string;
  /** One short line of detail, e.g. "Breathable kraft paper". */
  detail: string;
}

export interface EvidenceItem {
  id: string;
  /** Display number on the marker and in the log, e.g. "01". */
  number: string;
  name: string;
  /** Path to the item's picture, relative to the scene folder. */
  image: string;
  alt: string;
  /** Shown when the student examines the item. */
  description: string;
  /** Position on the background, as a percentage across and down. */
  x: number;
  y: number;
  /** Optional tweaks to how the picture sits on the background. */
  scale?: number;
  rotation?: number;
  /** The container that protects this item. */
  correct: PackageId;
  /** Why the right choice worked. */
  success: string;
  /** What went wrong, and why. */
  failure: string;
  /** Condition labels for each timeline step, in order. */
  conditionsIfCorrect: string[];
  conditionsIfWrong: string[];
}

export interface Scene {
  id: string;
  caseNumber: string;
  title: string;
  subtitle: string;
  location: string;
  conditions: string;
  role: string;
  time: string;
  summary: string;
  objective: string;
  /** Three letters used in the report's worksheet code, e.g. "RIV". */
  worksheetPrefix: string;
  background: { image: string; alt: string };
  /** Which containers this scene offers, in display order. */
  containers: PackageId[];
  evidence: EvidenceItem[];
}

/** One entry in `public/scenes/index.json`. */
export interface SceneSummary {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  caseNumber: string;
  blurb: string;
}
