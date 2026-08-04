<script lang="ts">
  import type { EvidenceItem } from "../lib/types";

  interface Props {
    item: EvidenceItem;
    /** The container the student picked, or undefined if it is still in the scene. */
    packedAs?: string;
    position: number;
    total: number;
    onselect: () => void;
  }

  let { item, packedAs, position, total, onselect }: Props = $props();

  let label = $derived(
    packedAs
      ? `${item.name}, item ${position} of ${total}, packaged in a ${packedAs}`
      : `${item.name}, item ${position} of ${total}, not yet collected`,
  );
</script>

<button
  class="evidence-marker"
  class:collected={Boolean(packedAs)}
  style="--x:{item.x}%; --y:{item.y}%"
  onclick={onselect}
  aria-label={label}
>
  {#if !packedAs}
    <span class="pulse"></span>
  {/if}
  <img src={item.image} alt="" />
  <span class="tag">
    <b>{packedAs ? "✓" : item.number}</b>{item.name}
  </span>
</button>

<style>
  .evidence-marker {
    --size: 46px;
    position: absolute;
    z-index: 8;
    left: var(--x);
    top: var(--y);
    width: var(--size);
    height: var(--size);
    padding: 0;
    border: 2px solid var(--acid);
    border-radius: 50%;
    background: #111914dc;
    color: white;
    cursor: pointer;
    transform: translate(-50%, -50%);
  }

  .evidence-marker img {
    width: 68%;
    height: 68%;
    object-fit: contain;
    filter: drop-shadow(0 2px 2px #000);
  }

  .pulse {
    position: absolute;
    inset: -7px;
    border: 1px solid var(--acid);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    50% {
      transform: scale(1.35);
      opacity: 0.1;
    }
  }

  .tag {
    position: absolute;
    top: calc(var(--size) + 5px);
    left: 50%;
    padding: 4px 7px;
    color: var(--paper);
    background: #101713e8;
    font: 600 9px var(--mono);
    white-space: nowrap;
    box-shadow: 2px 2px 0 #000;
    transform: translateX(-50%);
  }

  .tag b {
    margin-right: 5px;
    color: var(--acid);
  }

  .evidence-marker:hover,
  .evidence-marker:focus-visible {
    z-index: 12;
    outline: 2px solid white;
    transform: translate(-50%, -50%) scale(1.14);
  }

  .evidence-marker.collected {
    border-color: #89a884;
    background: #385038;
  }

  @media (max-width: 600px) {
    .evidence-marker {
      --size: 36px;
    }

    .tag {
      font-size: 7px;
    }
  }
</style>
