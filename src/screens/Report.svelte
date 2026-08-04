<script lang="ts">
  import { TIMELINE_HOURS } from "../lib/scenes";
  import { session } from "../lib/session.svelte";
  import type { Container, PackageId, Scene } from "../lib/types";

  interface Props {
    scene: Scene;
    containers: Record<PackageId, Container>;
    onretry: () => void;
    onchooseanother: () => void;
  }

  let { scene, containers, onretry, onchooseanother }: Props = $props();

  let studentName = $state("");

  let score = $derived(session.score);
  let finalHours = $derived(TIMELINE_HOURS[TIMELINE_HOURS.length - 1]);
  let worksheetCode = $derived(
    `${scene.worksheetPrefix}-${score.correct}${score.total - score.correct}-${finalHours}`,
  );
</script>

<main class="report-page">
  <section class="report-heading">
    <div>
      <p class="eyebrow">Final laboratory analysis</p>
      <h1 tabindex="-1">EVIDENCE INTEGRITY REPORT</h1>
      <p>
        Case {scene.caseNumber} · {scene.title} · Submitted {finalHours} hours after collection
      </p>
      <label class="student-name">
        <span>EXAMINER</span>
        <input type="text" bind:value={studentName} placeholder="Write your name" />
      </label>
    </div>
    <div class="score-seal">
      <span>INTEGRITY SCORE</span>
      <strong>{score.correct}<small>/{score.total}</small></strong>
      <b>{score.rank}</b>
    </div>
  </section>

  <section class="report-summary">
    <div>
      <span>{score.percent}%</span>
      <p>
        <strong>Evidence preserved</strong>
        Your packaging choices kept {score.correct} of {score.total} items suitable for laboratory
        analysis.
      </p>
    </div>
    <div>
      <span>{score.total - score.correct}</span>
      <p>
        <strong>Items compromised</strong>
        Review each item below to see what happened and why.
      </p>
    </div>
    <div class="case-code">
      <small>WORKSHEET CODE</small>
      <strong>{worksheetCode}</strong>
    </div>
  </section>

  <section class="results">
    <div class="results-title">
      <h2>ITEM-BY-ITEM ANALYSIS</h2>
      <span>{finalHours}-HOUR CONDITION</span>
    </div>

    {#each scene.evidence as item (item.id)}
      {@const choice = session.choices[item.id]}
      {@const right = choice === item.correct}
      <article class="result-row" class:correct={right} class:incorrect={!right}>
        <div class="result-id">
          <img src={item.image} alt="" />
          <b>E-{item.number}</b>
        </div>
        <div>
          <h3>{item.name}</h3>
          <p>You chose: <strong>{containers[choice].label}</strong></p>
        </div>
        <div class="result-outcome">
          <span>{right ? "✓ PRESERVED" : "! COMPROMISED"}</span>
          <p>{right ? item.success : item.failure}</p>
          {#if !right}
            <small>Correct choice: {containers[item.correct].label}</small>
          {/if}
        </div>
      </article>
    {/each}
  </section>

  <div class="report-actions">
    <button class="secondary-button" onclick={onchooseanother}>CHOOSE ANOTHER SCENE</button>
    <button class="secondary-button" onclick={onretry}>TRY THIS SCENE AGAIN <b>↻</b></button>
    <button class="primary-button" onclick={() => window.print()}>PRINT / SAVE AS PDF</button>
  </div>
</main>

<style>
  .report-page {
    min-height: calc(100vh - 76px);
    padding: 45px clamp(22px, 6vw, 80px) 65px;
    color: var(--ink);
    background: #ded8c9;
  }

  .report-heading {
    max-width: 1120px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    gap: 30px;
    padding-bottom: 24px;
    border-bottom: 2px solid var(--ink);
  }

  .report-heading h1 {
    margin-bottom: 17px;
    font: 800 clamp(34px, 4vw, 52px) / 1 var(--display);
  }

  .report-heading .eyebrow {
    color: #6d776d;
  }

  .report-heading p:not(.eyebrow) {
    color: #5d655e;
    font: 400 10px var(--mono);
  }

  .student-name {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 14px;
  }

  .student-name span {
    color: #6d776d;
    font: 600 8px var(--mono);
    letter-spacing: 0.14em;
  }

  .student-name input {
    width: 260px;
    padding: 4px 2px;
    border: 0;
    border-bottom: 1px solid #7d8179;
    background: transparent;
    color: var(--ink);
    font: 600 15px var(--display);
  }

  .student-name input:focus {
    outline: none;
    border-bottom-color: var(--red);
  }

  .score-seal {
    min-width: 165px;
    padding: 10px 20px;
    border: 3px double #455346;
    font-family: var(--mono);
    text-align: center;
    transform: rotate(1deg);
  }

  .score-seal > span {
    font-size: 8px;
    letter-spacing: 0.12em;
  }

  .score-seal > strong {
    display: block;
    color: #3d6041;
    font-size: 38px;
    line-height: 1.1;
  }

  .score-seal strong small {
    font-size: 15px;
  }

  .score-seal > b {
    display: block;
    padding-top: 4px;
    border-top: 1px solid #6c766d;
    font-size: 9px;
    letter-spacing: 0.08em;
  }

  .report-summary {
    max-width: 1120px;
    margin: 25px auto;
    display: grid;
    grid-template-columns: 1fr 1fr 240px;
    border: 1px solid #9d9b90;
  }

  .report-summary > div {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 20px;
    border-right: 1px solid #9d9b90;
  }

  .report-summary > div:last-child {
    border-right: 0;
  }

  .report-summary span {
    color: #49634b;
    font: 800 30px var(--display);
  }

  .report-summary p {
    margin: 0;
    color: #555e56;
    font-size: 11px;
  }

  .report-summary p strong {
    display: block;
    color: var(--ink);
    font: 700 13px var(--display);
  }

  .report-summary .case-code {
    display: block;
    background: #cfc8b7;
    text-align: center;
  }

  .case-code small {
    display: block;
    font: 600 8px var(--mono);
    letter-spacing: 0.12em;
  }

  .case-code strong {
    color: var(--red);
    font: 700 18px var(--mono);
    letter-spacing: 0.08em;
  }

  .results {
    max-width: 1120px;
    margin: auto;
    border-top: 2px solid var(--ink);
  }

  .results-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0 8px;
    border-bottom: 1px solid #9d9b90;
  }

  .results-title h2 {
    margin: 0;
    font: 800 19px var(--display);
  }

  .results-title span {
    font: 500 8px var(--mono);
    letter-spacing: 0.1em;
  }

  .result-row {
    min-height: 89px;
    display: grid;
    grid-template-columns: 90px 1fr 1.6fr;
    align-items: center;
    border-bottom: 1px solid #a9a69b;
  }

  .result-id {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .result-id img {
    width: 30px;
  }

  .result-id b {
    font: 600 9px var(--mono);
  }

  .result-row h3 {
    margin: 0;
    font: 700 17px var(--display);
  }

  .result-row > div:nth-child(2) p {
    margin: 3px 0 0;
    color: #626a62;
    font: 400 9px var(--mono);
  }

  .result-outcome {
    padding-left: 24px;
    border-left: 1px solid #aaa79c;
  }

  .result-outcome > span {
    font: 700 9px var(--mono);
    letter-spacing: 0.08em;
  }

  .correct .result-outcome > span {
    color: #4b754e;
  }

  .incorrect .result-outcome > span {
    color: #a13f31;
  }

  .result-outcome p {
    margin: 4px 0 0;
    color: #505950;
    font-size: 11px;
  }

  .result-outcome small {
    display: block;
    margin-top: 5px;
    color: #893a30;
    font: 600 8px var(--mono);
  }

  .report-actions {
    max-width: 1120px;
    margin: 28px auto 0;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  .report-actions .secondary-button {
    color: var(--ink);
    border-color: #777b73;
  }

  @media (max-width: 900px) {
    .report-summary {
      grid-template-columns: 1fr 1fr;
    }

    .report-summary .case-code {
      grid-column: 1 / -1;
    }

    .report-summary > div:nth-child(2) {
      border-right: 0;
    }
  }

  @media (max-width: 600px) {
    .report-page {
      padding: 30px 14px 50px;
    }

    .report-heading {
      flex-direction: column;
    }

    .score-seal {
      align-self: flex-start;
    }

    .report-summary {
      grid-template-columns: 1fr;
    }

    .report-summary > div {
      border-right: 0;
      border-bottom: 1px solid #9d9b90;
    }

    .report-summary .case-code {
      grid-column: auto;
    }

    .result-row {
      grid-template-columns: 65px 1fr;
      padding: 12px 0;
    }

    .result-outcome {
      grid-column: 1 / -1;
      padding: 10px 0 0;
      border: 0;
    }

    .report-actions {
      flex-direction: column;
    }
  }
</style>
