import { TIMELINE_HOURS } from "./scenes";
import type { PackageId, Scene } from "./types";

/**
 * One student's run through one crime scene.
 *
 * This is the app's only shared state. Screens read it and change it directly,
 * which keeps the flow easy to follow: there is exactly one place to look to
 * find out what the student has done so far.
 */

export type Screen = "select" | "briefing" | "scene" | "timeline" | "report";

export interface Score {
  correct: number;
  total: number;
  percent: number;
  rank: string;
}

function rankFor(percent: number): string {
  if (percent === 100) return "EXEMPLARY";
  if (percent >= 75) return "PROFICIENT";
  if (percent >= 50) return "DEVELOPING";
  return "REVIEW REQUIRED";
}

class Session {
  screen = $state<Screen>("select");
  scene = $state<Scene | null>(null);
  /** Evidence id -> the container the student chose. A plain object, so Svelte tracks changes to it. */
  choices = $state<Record<string, PackageId>>({});
  /** How far along the timeline we are: 0 = just sealed, then one per TIMELINE_HOURS entry. */
  step = $state(0);
  /** Which item's examine window is open, if any. */
  openItemId = $state<string | null>(null);

  packedCount = $derived(Object.keys(this.choices).length);
  totalCount = $derived(this.scene?.evidence.length ?? 0);
  isComplete = $derived(this.totalCount > 0 && this.packedCount === this.totalCount);
  elapsedHours = $derived(this.step === 0 ? 0 : TIMELINE_HOURS[this.step - 1]);
  isFinalStep = $derived(this.step === TIMELINE_HOURS.length);

  openItem = $derived(this.scene?.evidence.find((item) => item.id === this.openItemId) ?? null);

  score = $derived.by((): Score => {
    const evidence = this.scene?.evidence ?? [];
    const correct = evidence.filter((item) => this.choices[item.id] === item.correct).length;
    const total = evidence.length;
    const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
    return { correct, total, percent, rank: rankFor(percent) };
  });

  /** True once the student has packed an item correctly, used by the timeline and report. */
  wasPackedWell(itemId: string, correct: PackageId): boolean {
    return this.choices[itemId] === correct;
  }

  start(scene: Scene) {
    this.scene = scene;
    this.choices = {};
    this.step = 0;
    this.openItemId = null;
    this.screen = "briefing";
  }

  packItem(itemId: string, container: PackageId) {
    this.choices[itemId] = container;
    this.openItemId = null;
  }

  advance() {
    if (!this.isFinalStep) this.step += 1;
  }

  /** Play the same scene again from its briefing. */
  retry() {
    if (this.scene) this.start(this.scene);
  }

  /** Go back to the crime scene picker. */
  backToSelect() {
    this.scene = null;
    this.choices = {};
    this.step = 0;
    this.openItemId = null;
    this.screen = "select";
  }
}

export const session = new Session();
