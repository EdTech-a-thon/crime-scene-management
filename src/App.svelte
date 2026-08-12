<script lang="ts">
  import Footer from "./components/Footer.svelte";
  import TopBar from "./components/TopBar.svelte";
  import { navigate, router } from "./lib/router.svelte";
  import { loadContainers, loadScene, loadSceneList } from "./lib/scenes";
  import { session } from "./lib/session.svelte";
  import type { Container, PackageId, SceneSummary } from "./lib/types";
  import About from "./screens/About.svelte";
  import Briefing from "./screens/Briefing.svelte";
  import Privacy from "./screens/Privacy.svelte";
  import Report from "./screens/Report.svelte";
  import Scene from "./screens/Scene.svelte";
  import SceneSelect from "./screens/SceneSelect.svelte";
  import Timeline from "./screens/Timeline.svelte";

  let sceneList = $state<SceneSummary[]>([]);
  let containers = $state<Record<PackageId, Container>>({});
  let error = $state<string | null>(null);
  let ready = $state(false);

  // Load the list of crime scenes and the packaging options once, at start-up.
  $effect(() => {
    Promise.all([loadSceneList(), loadContainers()])
      .then(([list, options]) => {
        sceneList = list;
        containers = options;
        ready = true;
      })
      .catch((problem: Error) => (error = problem.message));
  });

  async function chooseScene(id: string) {
    try {
      session.start(await loadScene(id, containers));
    } catch (problem) {
      error = (problem as Error).message;
    }
  }

  // Each new screen or page starts at the top, with focus on its heading, so
  // keyboard and screen reader users are not left where the previous one ended.
  $effect(() => {
    session.screen;
    router.path;
    window.scrollTo(0, 0);
    requestAnimationFrame(() => document.querySelector<HTMLElement>("h1[tabindex]")?.focus());
  });

  // The brand in the top bar always leads back to the simulator itself.
  function goHome() {
    navigate("/");
    session.backToSelect();
  }
</script>

<div class="app-shell">
  <TopBar
    caseNumber={session.scene?.caseNumber}
    backLink={router.path !== "/"}
    onhome={goHome}
  />

  {#if router.path === "/about"}
    <About />
  {:else if router.path === "/privacy"}
    <Privacy />
  {:else if error}
    <main class="app-message">
      <h1>THIS CASE FILE COULD NOT BE OPENED</h1>
      <p>{error}</p>
      <p class="hint">Check the files in <code>public/scenes/</code>, then reload the page.</p>
    </main>
  {:else if !ready}
    <main class="app-message"><p>Opening the case files…</p></main>
  {:else if session.screen === "select"}
    <SceneSelect scenes={sceneList} onchoose={chooseScene} />
  {:else if session.scene}
    {#if session.screen === "briefing"}
      <Briefing scene={session.scene} onstart={() => (session.screen = "scene")} />
    {:else if session.screen === "scene"}
      <Scene
        scene={session.scene}
        {containers}
        onseal={() => {
          session.step = 0;
          session.screen = "timeline";
        }}
      />
    {:else if session.screen === "timeline"}
      <Timeline scene={session.scene} {containers} onreport={() => (session.screen = "report")} />
    {:else if session.screen === "report"}
      <Report
        scene={session.scene}
        {containers}
        onretry={() => session.retry()}
        onchooseanother={() => session.backToSelect()}
      />
    {/if}
  {/if}

  <Footer />
</div>

<style>
  /*
   * Top bar, screen, footer. The screen in the middle stretches to fill
   * whatever height is left, so short pages still cover the window and the
   * footer always sits below the content rather than floating over it.
   */
  .app-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .app-shell > :global(main) {
    flex: 1 1 auto;
  }

  .app-message {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 40px;
    text-align: center;
  }

  .app-message h1 {
    color: var(--acid);
    font: 800 clamp(26px, 4vw, 40px) var(--display);
  }

  .app-message p {
    max-width: 620px;
    color: #9ca69e;
    font-family: var(--mono);
    font-size: 13px;
  }

  .hint {
    color: #79877c;
    font-size: 11px;
  }

  code {
    color: var(--paper);
  }
</style>
