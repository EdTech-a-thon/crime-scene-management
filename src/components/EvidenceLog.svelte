<script lang="ts">
  import type { Container, EvidenceItem, PackageId } from "../lib/types";

  interface Props {
    evidence: EvidenceItem[];
    choices: Record<string, PackageId>;
    containers: Record<PackageId, Container>;
    complete: boolean;
    onselect: (itemId: string) => void;
    onseal: () => void;
  }

  let { evidence, choices, containers, complete, onselect, onseal }: Props = $props();

  let remaining = $derived(evidence.length - Object.keys(choices).length);
</script>

<aside class="inventory">
  <div class="inventory-title">
    <div>
      <p class="eyebrow">Chain of custody</p>
      <h2>EVIDENCE LOG</h2>
    </div>
    <span>● LIVE</span>
  </div>

  <div class="inventory-list">
    {#each evidence as item (item.id)}
      {@const choice = choices[item.id]}
      <button class="inventory-item" class:secured={Boolean(choice)} onclick={() => onselect(item.id)}>
        <b>{choice ? "✓" : item.number}</b>
        <span>
          <strong>{item.name}</strong>
          <small>{choice ? containers[choice].label : "Not yet collected"}</small>
        </span>
      </button>
    {/each}
  </div>

  <div class="inventory-footer">
    <button class="primary-button full" disabled={!complete} onclick={onseal}>
      SEAL &amp; TRANSPORT <b>→</b>
    </button>
    <p>
      {complete
        ? "All evidence collected. Ready for transport."
        : `${remaining} item${remaining === 1 ? "" : "s"} remain in the scene.`}
    </p>
  </div>
</aside>

<style>
  .inventory {
    display: flex;
    flex-direction: column;
    color: var(--ink);
    background: #e3ded0;
    border-left: 7px solid #0a100c;
  }

  .inventory-title {
    display: flex;
    justify-content: space-between;
    align-items: start;
    padding: 27px 23px 18px;
    border-bottom: 2px solid #303832;
  }

  .inventory-title h2 {
    margin: 0;
    font: 800 27px var(--display);
  }

  .inventory-title > span {
    color: #587452;
    font: 700 8px var(--mono);
  }

  .inventory-list {
    flex: 1;
    padding: 8px 18px;
  }

  .inventory-item {
    width: 100%;
    display: flex;
    gap: 12px;
    padding: 11px 4px;
    border: 0;
    border-bottom: 1px solid #777b7045;
    background: transparent;
    color: var(--ink);
    text-align: left;
    cursor: pointer;
  }

  .inventory-item > b {
    flex: 0 0 27px;
    height: 27px;
    display: grid;
    place-items: center;
    border: 1px solid #9c9b8e;
    font: 600 10px var(--mono);
  }

  .inventory-item span {
    min-width: 0;
  }

  .inventory-item strong,
  .inventory-item small {
    display: block;
  }

  .inventory-item strong {
    font: 600 13px var(--display);
  }

  .inventory-item small {
    margin-top: 3px;
    color: #777c73;
    font: 400 8px var(--mono);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .inventory-item.secured > b {
    background: #506c50;
    border-color: #506c50;
    color: white;
  }

  .inventory-item:hover {
    background: #ffffff60;
  }

  .inventory-footer {
    padding: 20px;
    background: #cfc8b7;
    text-align: center;
  }

  .inventory-footer p {
    margin: 10px 0 0;
    color: #666d64;
    font: 400 9px var(--mono);
  }

  @media (max-width: 900px) {
    .inventory {
      border: 0;
    }

    .inventory-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 600px) {
    .inventory-list {
      grid-template-columns: 1fr;
    }
  }
</style>
