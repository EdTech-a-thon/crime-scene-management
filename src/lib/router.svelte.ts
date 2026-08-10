/**
 * The smallest router that does the job.
 *
 * The simulator itself is one page; only the About and Privacy pages need real
 * URLs so they can be linked to and shared. Anything else falls back to the
 * simulator, so an unknown address still lands somewhere useful.
 */

const NAV_EVENT = "evidenceroom:navigate";

export type Route = "/about" | "/privacy" | "/";

function readPath(): Route {
  const path = window.location.pathname.replace(/\/+$/, "");
  return path === "/about" || path === "/privacy" ? path : "/";
}

class Router {
  path = $state<Route>(readPath());

  constructor() {
    const sync = () => (this.path = readPath());
    // Back/forward buttons, plus our own in-page links.
    window.addEventListener("popstate", sync);
    window.addEventListener(NAV_EVENT, sync);
  }
}

export const router = new Router();

export function navigate(to: string): void {
  if (window.location.pathname === to) return;
  window.history.pushState(null, "", to);
  window.dispatchEvent(new Event(NAV_EVENT));
}
