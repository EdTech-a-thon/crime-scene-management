<script lang="ts">
  import type { SceneSummary } from "../lib/types";

  interface Props {
    scenes: SceneSummary[];
    onchoose: (id: string) => void;
  }

  let { scenes, onchoose }: Props = $props();
</script>

<main class="select-page">
  <section class="select-heading">
    <p class="eyebrow">Forensic training unit</p>
    <h1 tabindex="-1">CHOOSE YOUR CASE</h1>
    <p class="lead">
      Each case is a different crime scene with its own evidence. Collect every item, choose how to
      package it, then find out how well the evidence survived the journey to the laboratory.
    </p>
  </section>

  <section class="case-grid">
    {#each scenes as scene, index (scene.id)}
      <button class="case-card" onclick={() => onchoose(scene.id)}>
        <div class="case-card-top">
          <span class="case-index">{String(index + 1).padStart(2, "0")}</span>
          <span class="case-number">CASE {scene.caseNumber}</span>
        </div>
        <p class="eyebrow">{scene.subtitle}</p>
        <h2>{scene.title}</h2>
        <dl>
          <dt>LOCATION</dt>
          <dd>{scene.location}</dd>
        </dl>
        <p class="blurb">{scene.blurb}</p>
        <span class="case-open">OPEN CASE FILE <b>→</b></span>
      </button>
    {/each}
  </section>
</main>

<style>
  .select-page {
    padding: clamp(30px, 5vw, 70px) clamp(20px, 5vw, 70px) 70px;
    background:
      radial-gradient(circle at 20% 10%, #314136 0, transparent 34%),
      linear-gradient(120deg, #101813, #18241c);
  }

  .select-heading {
    max-width: 1180px;
    margin: 0 auto 40px;
  }

  .select-heading h1 {
    margin-bottom: 16px;
    font: 800 clamp(40px, 6vw, 68px) / 0.9 var(--display);
    letter-spacing: -0.02em;
  }

  .lead {
    max-width: 620px;
    color: #9ca69e;
    font-size: 16px;
    line-height: 1.55;
  }

  .case-grid {
    max-width: 1180px;
    margin: auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  .case-card {
    display: flex;
    flex-direction: column;
    padding: 22px 24px 24px;
    border: 0;
    color: var(--ink);
    background-color: var(--paper);
    background-image: repeating-linear-gradient(0deg, transparent 0 3px, #605b5010 4px);
    box-shadow: 10px 11px 0 #070b0866;
    text-align: left;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .case-card:hover,
  .case-card:focus-visible {
    transform: translateY(-4px);
    box-shadow: 12px 15px 0 #070b0899;
  }

  .case-card-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-bottom: 10px;
    margin-bottom: 16px;
    border-bottom: 2px solid var(--ink);
  }

  .case-index {
    color: var(--red);
    font: 800 30px var(--display);
    line-height: 1;
  }

  .case-number {
    font: 600 10px var(--mono);
    letter-spacing: 0.12em;
  }

  .case-card h2 {
    margin-bottom: 14px;
    font: 800 clamp(26px, 2.6vw, 32px) / 0.95 var(--display);
    text-transform: uppercase;
  }

  .case-card dl {
    margin: 0 0 14px;
    padding: 12px 0;
    border-top: 1px solid #252b2657;
    border-bottom: 1px solid #252b2657;
  }

  .case-card dt {
    color: #777a72;
    font: 600 8px var(--mono);
    letter-spacing: 0.14em;
  }

  .case-card dd {
    margin: 4px 0 0;
    font: 600 14px var(--display);
  }

  .blurb {
    flex: 1;
    color: #465047;
    font-size: 14px;
    line-height: 1.5;
  }

  .case-open {
    margin-top: 8px;
    color: #3d5842;
    font: 700 11px var(--mono);
    letter-spacing: 0.08em;
  }

  .case-open b {
    margin-left: 10px;
    font-size: 15px;
  }
</style>
