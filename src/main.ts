import PocketBase, { ClientResponseError, type RecordModel } from "pocketbase";
import "./style.css";

interface Placement {
  objectId: string;
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
}

interface Lesson extends RecordModel {
  name: string;
  description: string;
  teacher: string;
  backgroundId: string;
  objects: Placement[];
  shareToken: string;
  published: boolean;
}

interface BackgroundAsset {
  id: string;
  name: string;
  image: string;
  alt: string;
  width: number;
  height: number;
}

interface ObjectAsset {
  id: string;
  name: string;
  image: string;
  alt: string;
}

const pb = new PocketBase(window.location.origin);
const app = document.querySelector<HTMLDivElement>("#app")!;

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function navigate(path: string): void {
  window.history.pushState({}, "", path);
  void route();
}

function messageFrom(error: unknown): string {
  if (error instanceof ClientResponseError) {
    const fields = Object.values(error.response?.data ?? {}) as Array<{ message?: string }>;
    return fields[0]?.message || error.response?.message || "That request could not be completed.";
  }
  return "Something went wrong. Please try again.";
}

function loading(label = "Loading lesson room"): void {
  app.innerHTML = `<main class="center-page"><div class="loader" aria-label="${escapeHtml(label)}"></div><p>${escapeHtml(label)}</p></main>`;
}

function authPage(mode: "signin" | "register", error = ""): void {
  const registering = mode === "register";
  app.innerHTML = `
    <main class="auth-page">
      <section class="auth-intro">
        <a class="wordmark light" href="/" data-link><span>ER</span><strong>EVIDENCE ROOM<small>FORENSIC TRAINING UNIT</small></strong></a>
        <div><p class="kicker">Instructor command desk</p><h1>PREPARE THE<br>CASE FILE.</h1><p>Manage your forensic training scenarios, review their status, and send investigators straight to the scene.</p></div>
        <blockquote>Every well-run investigation begins with a clear chain of custody.</blockquote>
      </section>
      <section class="auth-panel">
        <form class="auth-form" id="auth-form">
          <p class="step">Instructor access / secured</p>
          <h2>${registering ? "Create your account" : "Welcome back"}</h2>
          <p>${registering ? "Use your school email to create an instructor account." : "Sign in to review the case files assigned to your account."}</p>
          ${error ? `<div class="form-error" role="alert">${escapeHtml(error)}</div>` : ""}
          <label>Email address<input required name="email" type="email" autocomplete="email" placeholder="teacher@school.org"></label>
          <label>Password<input required minlength="8" name="password" type="password" autocomplete="${registering ? "new-password" : "current-password"}" placeholder="At least 8 characters"></label>
          ${registering ? `<label>Confirm password<input required minlength="8" name="passwordConfirm" type="password" autocomplete="new-password" placeholder="Repeat your password"></label>` : ""}
          <button class="button primary" type="submit">${registering ? "Create instructor account" : "Access case files"}<span>→</span></button>
          <p class="switch">${registering ? "Already have an account?" : "New instructor?"} <a href="/${registering ? "signin" : "register"}" data-link>${registering ? "Sign in" : "Create an account"}</a></p>
        </form>
      </section>
    </main>`;

  document.querySelector<HTMLFormElement>("#auth-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const button = form.querySelector<HTMLButtonElement>("button[type=submit]")!;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    button.disabled = true;
    button.textContent = registering ? "Creating account..." : "Signing in...";
    try {
      if (registering) {
        await pb.collection("teachers").create({
          email,
          password,
          passwordConfirm: String(data.get("passwordConfirm") ?? ""),
        });
      }
      await pb.collection("teachers").authWithPassword(email, password);
      navigate("/dashboard");
    } catch (requestError) {
      authPage(mode, messageFrom(requestError));
    }
  });
}

async function dashboard(): Promise<void> {
  if (!pb.authStore.isValid) {
    navigate("/signin");
    return;
  }
  loading("Loading your lessons");
  try {
    const lessons = await pb.collection("lessons").getFullList<Lesson>({ sort: "-updated" });
    const email = pb.authStore.record?.email ?? "Teacher";
    app.innerHTML = `
      <header class="teacher-header">
        <a class="wordmark" href="/dashboard" data-link><span>ER</span><strong>EVIDENCE ROOM<small>FORENSIC TRAINING UNIT</small></strong></a>
        <div class="account"><span>${escapeHtml(email)}</span><button class="text-button" data-action="logout">Sign out</button></div>
      </header>
      <main class="dashboard">
        <section class="dashboard-heading"><div><p class="kicker">Instructor command desk</p><h1>CASE FILES</h1><p>Review a scenario, inspect the student view, or send a secure briefing link to your investigators.</p></div><div class="lesson-count"><strong>${lessons.length}</strong><span>${lessons.length === 1 ? "case file" : "case files"}</span></div></section>
        ${lessons.length ? `<section class="lesson-grid">${lessons.map(lessonCard).join("")}</section>` : emptyLibrary()}
        <aside class="admin-note"><span>Managing lesson data</span><p>Lesson configuration is intentionally kept out of this prototype. A PocketBase administrator can add lessons and assign them to your account from <a href="/_/" target="_blank" rel="noreferrer">the data dashboard</a>.</p></aside>
      </main>`;
  } catch (error) {
    errorPage("We could not load your lessons", messageFrom(error), "/dashboard", "Try again");
  }
}

function lessonCard(lesson: Lesson): string {
  const status = lesson.published ? "Published" : "Draft";
  return `<article class="lesson-card">
    <div class="card-top"><span class="status ${lesson.published ? "live" : ""}">${status}</span><time>Updated ${formatDate(lesson.updated)}</time></div>
    <div><p class="lesson-number">Case ${escapeHtml(lesson.id.slice(-4).toUpperCase())}</p><h2>${escapeHtml(lesson.name)}</h2><p>${escapeHtml(lesson.description || "No case summary has been added yet.")}</p></div>
    <div class="card-meta"><span>${lesson.objects.length} ${lesson.objects.length === 1 ? "object" : "objects"}</span><span>${escapeHtml(lesson.backgroundId.replaceAll("-", " "))}</span></div>
    <div class="card-actions"><a class="button secondary" href="/preview/${encodeURIComponent(lesson.id)}" data-link>Inspect</a>${lesson.published ? `<button class="button primary copy-link" data-token="${escapeHtml(lesson.shareToken)}">Copy briefing link</button>` : `<button class="button primary" disabled>Publish to brief</button>`}</div>
  </article>`;
}

function emptyLibrary(): string {
  return `<section class="empty-library"><span>01</span><h2>No case files assigned yet</h2><p>Ask a PocketBase administrator to create a case file and choose your instructor account in its <strong>teacher</strong> field.</p><a class="button secondary" href="/_/" target="_blank" rel="noreferrer">Open data dashboard</a></section>`;
}

function formatDate(value: string): string {
  const date = new Date(value.replace(" ", "T") + "Z");
  return Number.isNaN(date.valueOf()) ? "recently" : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

async function loadAssets(): Promise<{ backgrounds: BackgroundAsset[]; objects: ObjectAsset[] }> {
  const [backgroundResponse, objectResponse] = await Promise.all([
    fetch("/assets/backgrounds/manifest.json"),
    fetch("/assets/objects/manifest.json"),
  ]);
  if (!backgroundResponse.ok || !objectResponse.ok) throw new Error("Asset manifests unavailable");
  const backgroundData = await backgroundResponse.json() as { backgrounds: BackgroundAsset[] };
  const objectData = await objectResponse.json() as { objects: ObjectAsset[] };
  return { backgrounds: backgroundData.backgrounds, objects: objectData.objects };
}

async function studentLesson(token: string): Promise<void> {
  loading("Opening your lesson");
  try {
    const safeToken = token.slice(0, 80);
    const [lesson, assets] = await Promise.all([
      pb.collection("lessons").getFirstListItem<Lesson>(pb.filter("shareToken = {:token}", { token: safeToken }), {
        query: { shareToken: safeToken },
      }),
      loadAssets(),
    ]);
    renderLesson(lesson, assets, false);
  } catch {
    errorPage("This lesson is not available", "The link may be incorrect, or the teacher may not have published the lesson yet.", "/signin", "Teacher sign in");
  }
}

async function previewLesson(id: string): Promise<void> {
  if (!pb.authStore.isValid) {
    navigate("/signin");
    return;
  }
  loading("Preparing lesson preview");
  try {
    const [lesson, assets] = await Promise.all([
      pb.collection("lessons").getOne<Lesson>(id),
      loadAssets(),
    ]);
    renderLesson(lesson, assets, true);
  } catch (error) {
    errorPage("Preview unavailable", messageFrom(error), "/dashboard", "Back to lessons");
  }
}

function renderLesson(lesson: Lesson, assets: { backgrounds: BackgroundAsset[]; objects: ObjectAsset[] }, preview: boolean): void {
  const background = assets.backgrounds.find(item => item.id === lesson.backgroundId);
  if (!background) {
    errorPage("Background missing", `The asset “${lesson.backgroundId}” is not in the background manifest.`, preview ? "/dashboard" : "/signin", preview ? "Back to lessons" : "Teacher sign in");
    return;
  }
  const objectMap = new Map(assets.objects.map(item => [item.id, item]));
  const placements = Array.isArray(lesson.objects) ? lesson.objects : [];
  app.innerHTML = `
    ${preview ? `<div class="preview-bar"><span>Instructor preview${lesson.published ? " · Published" : " · Draft"}</span><a href="/dashboard" data-link>Return to case files</a></div>` : ""}
    <header class="student-header"><div class="wordmark light"><span>ER</span><strong>EVIDENCE ROOM</strong></div><p>Forensic training unit</p></header>
    <main class="student-main">
      <section class="lesson-heading"><p class="kicker">Interactive lesson</p><h1>${escapeHtml(lesson.name)}</h1><p>${escapeHtml(lesson.description)}</p></section>
      <section class="lesson-stage" style="aspect-ratio:${background.width}/${background.height}" aria-label="${escapeHtml(background.alt)}">
        <img class="background-image" src="${escapeHtml(background.image)}" alt="${escapeHtml(background.alt)}">
        ${placements.map((placement, index) => placedObject(placement, objectMap, index)).join("")}
      </section>
      <p class="stage-note"><span>Explore</span> Select an object to see its name.</p>
    </main>`;
}

function placedObject(placement: Placement, objectMap: Map<string, ObjectAsset>, index: number): string {
  const asset = objectMap.get(placement.objectId);
  if (!asset || !Number.isFinite(placement.x) || !Number.isFinite(placement.y)) return "";
  const x = Math.max(0, Math.min(100, placement.x));
  const y = Math.max(0, Math.min(100, placement.y));
  const scale = Math.max(0.4, Math.min(2.5, Number(placement.scale) || 1));
  const rotation = Math.max(-180, Math.min(180, Number(placement.rotation) || 0));
  return `<button class="placed-object" style="--x:${x}%;--y:${y}%;--scale:${scale};--rotation:${rotation}deg" aria-label="${escapeHtml(asset.name)}" data-object-label="${escapeHtml(asset.name)}"><img src="${escapeHtml(asset.image)}" alt="${escapeHtml(asset.alt)}"><span><b>${String(index + 1).padStart(2, "0")}</b>${escapeHtml(asset.name)}</span></button>`;
}

function errorPage(title: string, detail: string, path: string, action: string): void {
  app.innerHTML = `<main class="error-page"><a class="wordmark light" href="/" data-link><span>ER</span><strong>EVIDENCE ROOM</strong></a><div><p class="error-code">404 / Evidence Room</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(detail)}</p><a class="button primary" href="${escapeHtml(path)}" data-link>${escapeHtml(action)} <span>→</span></a></div></main>`;
}

async function route(): Promise<void> {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/" || path === "/signin") {
    if (pb.authStore.isValid) await dashboard(); else authPage("signin");
    return;
  }
  if (path === "/register") {
    if (pb.authStore.isValid) await dashboard(); else authPage("register");
    return;
  }
  if (path === "/dashboard") {
    await dashboard();
    return;
  }
  const lessonMatch = path.match(/^\/lesson\/([^/]+)$/);
  if (lessonMatch) {
    await studentLesson(decodeURIComponent(lessonMatch[1]));
    return;
  }
  const previewMatch = path.match(/^\/preview\/([^/]+)$/);
  if (previewMatch) {
    await previewLesson(decodeURIComponent(previewMatch[1]));
    return;
  }
  errorPage("Page not found", "There is no page at this address.", "/", "Go home");
}

document.addEventListener("click", async (event) => {
  const target = event.target as HTMLElement;
  const link = target.closest<HTMLAnchorElement>("a[data-link]");
  if (link && link.origin === window.location.origin) {
    event.preventDefault();
    navigate(link.pathname);
    return;
  }
  const logout = target.closest<HTMLElement>("[data-action=logout]");
  if (logout) {
    pb.authStore.clear();
    navigate("/signin");
    return;
  }
  const copyButton = target.closest<HTMLButtonElement>(".copy-link");
  if (copyButton?.dataset.token) {
    const url = `${window.location.origin}/lesson/${encodeURIComponent(copyButton.dataset.token)}`;
    await navigator.clipboard.writeText(url);
    copyButton.textContent = "Briefing copied";
    window.setTimeout(() => { copyButton.textContent = "Copy briefing link"; }, 1800);
  }
});

window.addEventListener("popstate", () => void route());
void route();
