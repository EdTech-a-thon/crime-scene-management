<script lang="ts">
  import { TIMELINE_HOURS } from "../lib/scenes";
  import { session } from "../lib/session.svelte";
  import type { Container, EvidenceItem, PackageId, Scene } from "../lib/types";

  interface Props {
    scene: Scene;
    containers: Record<PackageId, Container>;
    onreport: () => void;
  }

  let { scene, containers, onreport }: Props = $props();

  /** The label to show for one item at the point in time we have reached. */
  function conditionFor(item: EvidenceItem): string {
    if (session.step === 0) return "SEALED";
    const labels = session.wasPackedWell(item.id, item.correct)
      ? item.conditionsIfCorrect
      : item.conditionsIfWrong;
    return labels[session.step - 1];
  }

  let trackWidth = $derived((session.step / TIMELINE_HOURS.length) * 100);
  let nextHours = $derived(TIMELINE_HOURS[session.step]);
</script>

<main class="time-page">
  <section class="transport-header">
    <div>
      <p class="eyebrow">Evidence transport / Lab intake</p>
      <h1 tabindex="-1">WHAT HAPPENS OVER TIME?</h1>
      <p>
        The evidence is sealed. Advance the clock to observe how your packaging decisions affect
        each item.
      </p>
    </div>
    <div class="clock">
      <span>ELAPSED TIME</span>
      <strong>{String(session.elapsedHours).padStart(2, "0")}:00</strong>
      <small>HOURS</small>
    </div>
  </section>

  <section class="timeline">
    <div class="timeline-track"><span style="width:{trackWidth}%"></span></div>
    <div class="time-node active">
      <b>00</b>
      <span>SEALED</span>
    </div>
    {#each TIMELINE_HOURS as hours, index (hours)}
      <div class="time-node" class:active={session.step >= index + 1}>
        <b>{hours}</b>
        <span>HOURS</span>
      </div>
    {/each}
  </section>

  <section class="lab-grid">
    {#each scene.evidence as item (item.id)}
      {@const packedWell = session.wasPackedWell(item.id, item.correct)}
      {@const revealed = session.step > 0}
      <article
        class="lab-item"
        class:degraded={revealed && !packedWell}
        class:stable={revealed && packedWell}
      >
        <div class="lab-icon">
          <img src={item.image} alt="" />
          {#if revealed && !packedWell}<i>!</i>{/if}
        </div>
        <div class="lab-info">
          <span>E-{item.number}</span>
          <h3>{item.name}</h3>
          <p>{containers[session.choices[item.id]].label}</p>
        </div>
        <div class="condition">
          <small>CONDITION</small>
          <strong>{conditionFor(item)}</strong>
        </div>
      </article>
    {/each}
  </section>

  <div class="time-actions">
    {#if !session.isFinalStep}
      <button class="primary-button" onclick={() => session.advance()}>
        ADVANCE TO {nextHours} HOURS <b>→</b>
      </button>
    {:else}
      <button class="primary-button" onclick={onreport}>OPEN LAB REPORT <b>→</b></button>
    {/if}
    {#if session.step > 0}
      <p>
        <strong>{session.score.correct} stable</strong> ·
        {session.score.total - session.score.correct} compromised
      </p>
    {/if}
  </div>
</main>

<style>
  .time-page {
    min-height: calc(100vh - 76px);
    padding: 45px clamp(22px, 6vw, 80px) 65px;
    background: radial-gradient(circle at 80% 10%, #2d3c31, transparent 30%), var(--forest);
  }

  .transport-header {
    max-width: 1120px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    gap: 30px;
    padding-bottom: 24px;
    border-bottom: 1px solid #ffffff2c;
  }

  .transport-header > div:first-child {
    max-width: 680px;
  }

  .transport-header h1 {
    margin-bottom: 17px;
    font: 800 clamp(34px, 4vw, 52px) / 1 var(--display);
  }

  .transport-header p:not(.eyebrow) {
    color: #9ca69e;
    font-size: 14px;
  }

  .clock {
    min-width: 185px;
    padding: 15px 22px;
    border: 1px solid #657064;
    font-family: var(--mono);
    text-align: center;
  }

  .clock span,
  .clock small {
    display: block;
    color: #89958b;
    font-size: 8px;
    letter-spacing: 0.16em;
  }

  .clock strong {
    display: block;
    margin: 4px 0;
    color: var(--acid);
    font-size: 33px;
  }

  .timeline {
    position: relative;
    max-width: 770px;
    margin: 35px auto 45px;
    display: flex;
    justify-content: space-between;
  }

  .timeline-track {
    position: absolute;
    top: 18px;
    left: 35px;
    right: 35px;
    height: 2px;
    background: #59635b;
  }

  .timeline-track span {
    display: block;
    height: 100%;
    background: var(--acid);
    transition: width 0.6s ease;
  }

  .time-node {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #737f76;
    font-family: var(--mono);
  }

  .time-node b {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border: 2px solid #647068;
    border-radius: 50%;
    background: var(--forest);
    font-size: 10px;
  }

  .time-node span {
    margin-top: 8px;
    font-size: 8px;
    letter-spacing: 0.12em;
  }

  .time-node.active b {
    border-color: var(--acid);
    background: var(--acid);
    color: var(--forest);
  }

  .time-node.active span {
    color: var(--acid);
  }

  .lab-grid {
    max-width: 1120px;
    margin: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .lab-item {
    min-height: 91px;
    display: grid;
    grid-template-columns: 65px 1fr auto;
    align-items: center;
    padding: 10px 15px;
    border: 1px solid #ffffff24;
    background: #202c24;
    transition: 0.4s ease;
  }

  .lab-icon {
    position: relative;
    width: 52px;
    height: 58px;
    display: grid;
    place-items: center;
    background: #131b16;
  }

  .lab-icon img {
    width: 34px;
  }

  .lab-icon i {
    position: absolute;
    right: -5px;
    top: -5px;
    width: 19px;
    height: 19px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #b64b37;
    color: white;
    font: 700 11px var(--mono);
    font-style: normal;
  }

  .lab-info > span {
    color: var(--acid);
    font: 600 9px var(--mono);
  }

  .lab-info h3 {
    margin: 2px 0;
    font: 600 17px var(--display);
  }

  .lab-info p {
    margin: 0;
    color: #a3aea5;
    font: 400 9px var(--mono);
  }

  .condition {
    font-family: var(--mono);
    text-align: right;
  }

  .condition small {
    display: block;
    color: #8a958c;
    font-size: 8px;
  }

  .condition strong {
    color: #c6cec7;
    font-size: 10px;
  }

  .lab-item.stable {
    border-left: 4px solid #75946e;
  }

  .lab-item.stable .condition strong {
    color: #a3c39d;
  }

  .lab-item.degraded {
    background: #32241f;
    border-left: 4px solid #bd4e3a;
  }

  .lab-item.degraded .condition strong {
    color: #f0836d;
  }

  .lab-item.degraded .lab-icon {
    background: #2a1c18;
  }

  .time-actions {
    max-width: 1120px;
    margin: 30px auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .time-actions p {
    margin: 17px 0 0;
    color: #8f9a91;
    font: 400 10px var(--mono);
  }

  .time-actions p strong {
    color: #9db297;
  }

  @media (max-width: 900px) {
    .lab-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 600px) {
    .time-page {
      padding: 30px 14px 50px;
    }

    .transport-header {
      flex-direction: column;
    }

    .clock {
      align-self: flex-start;
    }

    .lab-item {
      grid-template-columns: 55px 1fr;
    }

    .condition {
      grid-column: 2;
      text-align: left;
    }
  }
</style>
