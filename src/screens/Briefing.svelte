<script lang="ts">
  import type { Scene } from "../lib/types";

  interface Props {
    scene: Scene;
    onstart: () => void;
  }

  let { scene, onstart }: Props = $props();
</script>

<main class="briefing-page">
  <section class="briefing-card">
    <div class="briefing-kicker">
      <span>CASE BRIEF</span>
      <span>{scene.time}</span>
    </div>

    <div class="briefing-grid">
      <div>
        <p class="eyebrow">{scene.subtitle}</p>
        <h1 tabindex="-1">{scene.title}</h1>
        <p class="lead">{scene.summary}</p>

        <div class="objective">
          <span>01</span>
          <div>
            <strong>Your objective</strong>
            <p>{scene.objective}</p>
          </div>
        </div>

        <button class="primary-button" onclick={onstart}>ENTER THE SCENE <b>→</b></button>
      </div>

      <aside class="dispatch-note">
        <div class="clip"></div>
        <p class="mono-label">DISPATCH NOTES</p>
        <dl>
          <div>
            <dt>LOCATION</dt>
            <dd>{scene.location}</dd>
          </div>
          <div>
            <dt>CONDITIONS</dt>
            <dd>{scene.conditions}</dd>
          </div>
          <div>
            <dt>YOUR ROLE</dt>
            <dd>{scene.role}</dd>
          </div>
        </dl>
        <div class="tip">
          <strong>REMEMBER</strong>
          <p>Your packaging decision can preserve evidence or destroy it.</p>
        </div>
      </aside>
    </div>
  </section>
</main>

<style>
  .briefing-page {
    min-height: calc(100vh - 76px);
    display: grid;
    place-items: center;
    padding: clamp(25px, 5vw, 75px);
    background:
      radial-gradient(circle at 20% 20%, #314136 0, transparent 32%),
      linear-gradient(120deg, #101813, #18241c);
  }

  .briefing-card {
    position: relative;
    width: min(1040px, 100%);
    min-height: 590px;
    padding: 28px clamp(28px, 6vw, 78px) 55px;
    color: var(--ink);
    background-color: var(--paper);
    background-image: repeating-linear-gradient(0deg, transparent 0 3px, #605b5010 4px);
    box-shadow: 18px 19px 0 #070b087a;
    transform: rotate(-0.25deg);
  }

  .briefing-card::before {
    content: "CONFIDENTIAL • TRAINING USE ONLY";
    position: absolute;
    right: 22px;
    bottom: 35px;
    padding: 7px 12px;
    border: 4px solid #9e392f33;
    color: #9e392f33;
    font: 800 16px var(--display);
    transform: rotate(-10deg);
  }

  .briefing-kicker {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--ink);
    font: 600 10px var(--mono);
    letter-spacing: 0.12em;
  }

  .briefing-grid {
    display: grid;
    grid-template-columns: 1.6fr 0.75fr;
    gap: clamp(35px, 8vw, 100px);
    padding-top: 62px;
  }

  .briefing-grid h1 {
    margin-bottom: 26px;
    font: 800 clamp(44px, 6vw, 72px) / 0.86 var(--display);
    letter-spacing: -0.03em;
  }

  .lead {
    max-width: 550px;
    color: #3a433c;
    font-size: 17px;
    line-height: 1.55;
  }

  .objective {
    display: flex;
    gap: 18px;
    margin: 30px 0;
    padding: 17px 0;
    border-top: 1px solid #252b2657;
    border-bottom: 1px solid #252b2657;
  }

  .objective > span {
    color: var(--red);
    font: 800 29px var(--display);
  }

  .objective strong {
    font: 700 15px var(--display);
    text-transform: uppercase;
  }

  .objective p {
    margin: 3px 0 0;
    color: #465047;
    font-size: 14px;
  }

  .dispatch-note {
    position: relative;
    padding: 36px 28px 27px;
    background: #d9d1bd;
    box-shadow: 6px 7px 0 #4d493e24;
    transform: rotate(1.5deg);
  }

  .clip {
    position: absolute;
    top: -8px;
    left: calc(50% - 25px);
    width: 50px;
    height: 17px;
    background: #8a8c81;
  }

  .mono-label {
    padding-bottom: 10px;
    border-bottom: 1px solid #353d36;
    font: 700 14px var(--mono);
    letter-spacing: 0.08em;
  }

  .dispatch-note dl {
    margin: 0;
  }

  .dispatch-note dl div {
    padding: 13px 0;
    border-bottom: 1px dashed #6c7069;
  }

  .dispatch-note dt {
    color: #777a72;
    font: 600 8px var(--mono);
    letter-spacing: 0.14em;
  }

  .dispatch-note dd {
    margin: 4px 0 0;
    font: 600 14px var(--display);
    /* Dispatch details are written with line breaks in the scene file. */
    white-space: pre-line;
  }

  .tip {
    margin-top: 20px;
    padding: 13px;
    border: 1px solid #9f4235;
  }

  .tip strong {
    color: #963b30;
    font: 700 10px var(--mono);
  }

  .tip p {
    margin: 4px 0 0;
    font-size: 13px;
  }

  @media (max-width: 900px) {
    .briefing-grid {
      grid-template-columns: 1fr;
      padding-top: 40px;
    }

    .dispatch-note {
      max-width: 380px;
    }
  }

  @media (max-width: 600px) {
    .briefing-card {
      padding: 22px;
    }

    .briefing-grid h1 {
      font-size: 44px;
    }

    .briefing-card::before {
      display: none;
    }
  }
</style>
