<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    /** The small label above the heading. */
    eyebrow: string;
    title: string;
    /** One line under the heading saying what the page is for. */
    lead: string;
    children: Snippet;
  }

  let { eyebrow, title, lead, children }: Props = $props();
</script>

<!--
  The shared frame for the plain reading pages (About, Privacy): a stack of
  paper cards on the same dark background as the rest of the app. The card
  styles are global so each page can write ordinary markup inside it.
-->
<main class="info-page">
  <div class="info-inner">
    <p class="eyebrow">{eyebrow}</p>
    <h1 tabindex="-1">{title}</h1>
    <p class="info-lead">{lead}</p>
    {@render children()}
  </div>
</main>

<style>
  .info-page {
    padding: clamp(30px, 5vw, 66px) clamp(20px, 5vw, 70px) 70px;
    background:
      radial-gradient(circle at 20% 10%, #314136 0, transparent 34%),
      linear-gradient(120deg, #101813, #18241c);
  }

  .info-inner {
    width: min(760px, 100%);
    margin: 0 auto;
  }

  h1 {
    margin-bottom: 14px;
    font: 800 clamp(40px, 6vw, 62px) / 0.9 var(--display);
    letter-spacing: -0.02em;
  }

  .info-lead {
    margin-bottom: 32px;
    max-width: 620px;
    color: #a9b3ab;
    font-size: 17px;
    line-height: 1.55;
  }

  /* Everything below is for the markup each page passes in. */
  .info-inner :global(.info-card) {
    margin-bottom: 26px;
    padding: clamp(22px, 4vw, 34px);
    color: var(--ink);
    background-color: var(--paper);
    background-image: repeating-linear-gradient(0deg, transparent 0 3px, #605b5010 4px);
    box-shadow: 10px 11px 0 #070b0866;
  }

  .info-inner :global(.info-card h2) {
    margin-bottom: 12px;
    font: 700 clamp(23px, 3vw, 28px) var(--display);
    letter-spacing: 0.01em;
    text-transform: uppercase;
  }

  .info-inner :global(.info-card p),
  .info-inner :global(.info-card li) {
    color: #3a433c;
    font-size: 16px;
    line-height: 1.6;
  }

  .info-inner :global(.info-card p:last-child) {
    margin-bottom: 0;
  }

  /* Links inside the prose only, so a page can still style a button of its own. */
  .info-inner :global(.info-card p a),
  .info-inner :global(.info-card li a) {
    color: #8a3527;
    font-weight: 600;
    text-underline-offset: 3px;
  }

  .info-inner :global(.info-card p a:hover),
  .info-inner :global(.info-card li a:hover) {
    color: var(--red);
  }
</style>
