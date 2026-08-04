import type { Container, PackageId, Scene, SceneSummary } from "./types";

/**
 * Loads crime scene content from `public/scenes/`.
 *
 * Scene files are plain JSON served as static files, so a teacher can read them
 * and see exactly which picture each line points at. Everything is checked as it
 * loads, and mistakes are reported with the scene and item that caused them.
 */

/** How many hours pass at each step of the evidence timeline. */
export const TIMELINE_HOURS = [24, 72];

const SCENES_ROOT = "/scenes";

async function loadJson(path: string): Promise<unknown> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not read ${path} (${response.status}). Is the file there?`);
  }
  return response.json();
}

export async function loadSceneList(): Promise<SceneSummary[]> {
  const data = await loadJson(`${SCENES_ROOT}/index.json`);
  if (!Array.isArray(data)) throw new Error("scenes/index.json should be a list of scenes.");
  return data as SceneSummary[];
}

export async function loadContainers(): Promise<Record<PackageId, Container>> {
  const data = await loadJson(`${SCENES_ROOT}/containers.json`);
  return data as Record<PackageId, Container>;
}

/**
 * Reads one scene and checks it over. Image paths in the file are written
 * relative to the scene's own folder, and are expanded to full paths here.
 */
export async function loadScene(
  id: string,
  containers: Record<PackageId, Container>,
): Promise<Scene> {
  const folder = `${SCENES_ROOT}/${id}`;
  const scene = (await loadJson(`${folder}/scene.json`)) as Scene;

  const problem = (message: string) => new Error(`Scene "${id}": ${message}`);

  if (!scene.evidence?.length) throw problem("has no evidence items.");
  for (const name of scene.containers) {
    if (!containers[name]) throw problem(`offers "${name}", which is not in containers.json.`);
  }

  scene.background.image = `${folder}/${scene.background.image}`;

  const seen = new Set<string>();
  for (const item of scene.evidence) {
    const where = `item ${item.number} (${item.name})`;
    if (seen.has(item.id)) throw problem(`${where} repeats the id "${item.id}".`);
    seen.add(item.id);

    if (!scene.containers.includes(item.correct)) {
      throw problem(
        `${where} expects "${item.correct}", which this scene does not offer. ` +
          `Choose one of: ${scene.containers.join(", ")}.`,
      );
    }
    if (item.x < 0 || item.x > 100 || item.y < 0 || item.y > 100) {
      throw problem(`${where} sits at ${item.x},${item.y}. Use percentages between 0 and 100.`);
    }
    for (const field of ["conditionsIfCorrect", "conditionsIfWrong"] as const) {
      if (item[field]?.length !== TIMELINE_HOURS.length) {
        throw problem(`${where} needs ${TIMELINE_HOURS.length} entries in ${field}.`);
      }
    }

    item.image = `${folder}/${item.image}`;
  }

  return scene;
}
