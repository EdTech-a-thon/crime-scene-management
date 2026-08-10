<script lang="ts">
  import Link from "./Link.svelte";

  interface Props {
    /** The case number stamped on the right, when a scene is open. */
    caseNumber?: string;
    /** Shown instead of the case stamp on the About and Privacy pages. */
    backLink?: boolean;
    onhome: () => void;
  }

  let { caseNumber, backLink = false, onhome }: Props = $props();
</script>

<header class="topbar">
  <button class="brand" onclick={onhome} aria-label="Return to the crime scene list">
    <span class="brand-mark">ER</span>
    <span>
      <strong>EVIDENCE ROOM</strong>
      <small>FORENSIC TRAINING UNIT</small>
    </span>
  </button>

  {#if backLink}
    <Link href="/" class="back-link">← BACK TO THE CASE FILES</Link>
  {:else if caseNumber}
    <div class="case-stamp">
      <span>ACTIVE CASE</span>
      <strong>{caseNumber}</strong>
    </div>
  {/if}
</header>

<style>
  .topbar {
    position: relative;
    z-index: 20;
    height: 76px;
    padding: 0 4vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #0d1511;
    border-bottom: 1px solid #ffffff1f;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 13px;
    border: 0;
    color: var(--paper);
    background: none;
    text-align: left;
    cursor: pointer;
  }

  .brand-mark {
    width: 39px;
    height: 39px;
    display: grid;
    place-items: center;
    border: 1px solid var(--acid);
    color: var(--acid);
    font: 700 18px var(--display);
    transform: rotate(-2deg);
  }

  .brand strong,
  .brand small {
    display: block;
    font-family: var(--mono);
    letter-spacing: 0.1em;
  }

  .brand strong {
    font-size: 13px;
  }

  .brand small {
    margin-top: 3px;
    color: #9da89f;
    font-size: 8px;
  }

  .case-stamp {
    display: flex;
    flex-direction: column;
    padding-left: 24px;
    border-left: 1px solid #ffffff24;
    font-family: var(--mono);
  }

  .case-stamp span {
    color: #94a097;
    font-size: 8px;
    letter-spacing: 0.16em;
  }

  .case-stamp strong {
    color: var(--acid);
    font-size: 16px;
    letter-spacing: 0.08em;
  }

  .topbar :global(.back-link) {
    color: #9da89f;
    font: 600 10px var(--mono);
    letter-spacing: 0.12em;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .topbar :global(.back-link:hover) {
    color: var(--acid);
  }

  @media (max-width: 600px) {
    .topbar {
      height: 64px;
      padding: 0 15px;
    }

    .case-stamp {
      padding-left: 12px;
    }

    .case-stamp span {
      display: none;
    }

    .brand strong {
      font-size: 11px;
    }
  }
</style>
