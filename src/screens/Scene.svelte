<script lang="ts">
  import EvidenceLog from "../components/EvidenceLog.svelte";
  import EvidenceMarker from "../components/EvidenceMarker.svelte";
  import EvidenceModal from "../components/EvidenceModal.svelte";
  import { session } from "../lib/session.svelte";
  import type { Container, PackageId, Scene } from "../lib/types";

  interface Props {
    scene: Scene;
    containers: Record<PackageId, Container>;
    onseal: () => void;
  }

  let { scene, containers, onseal }: Props = $props();

  // Remember which marker opened the dialog, so focus can go back there on close.
  let lastTrigger: HTMLElement | null = null;

  function openItem(itemId: string) {
    lastTrigger = document.activeElement as HTMLElement;
    session.openItemId = itemId;
  }

  function closeItem() {
    session.openItemId = null;
    lastTrigger?.focus();
  }

  function packItem(choice: PackageId) {
    if (session.openItemId) session.packItem(session.openItemId, choice);
    lastTrigger?.focus();
  }
</script>

<main class="scene-layout">
  <section class="scene-column">
    <div class="scene-heading">
      <div>
        <p class="eyebrow">{scene.subtitle} / {scene.location.replace("\n", ", ")}</p>
        <h1 tabindex="-1">COLLECT THE EVIDENCE</h1>
      </div>
      <div class="progress">
        <strong>{session.packedCount}<span>/{session.totalCount}</span></strong>
        <small>ITEMS SECURED</small>
      </div>
    </div>

    <div class="room">
      <img class="room-image" src={scene.background.image} alt={scene.background.alt} />

      {#each scene.evidence as item, index (item.id)}
        <EvidenceMarker
          {item}
          packedAs={session.choices[item.id] ? containers[session.choices[item.id]].label : undefined}
          position={index + 1}
          total={scene.evidence.length}
          onselect={() => openItem(item.id)}
        />
      {/each}

      <div class="scene-tape">
        SCENE {scene.caseNumber} &nbsp; • &nbsp; DO NOT CROSS &nbsp; • &nbsp; SCENE {scene.caseNumber}
      </div>
    </div>

    <p class="scene-help">
      <span>◎</span> Select an evidence marker to inspect and package the item.
    </p>
  </section>

  <EvidenceLog
    evidence={scene.evidence}
    choices={session.choices}
    {containers}
    complete={session.isComplete}
    onselect={openItem}
    {onseal}
  />
</main>

{#if session.openItem}
  <EvidenceModal
    item={session.openItem}
    offered={scene.containers}
    {containers}
    current={session.choices[session.openItem.id]}
    onpackage={packItem}
    onclose={closeItem}
  />
{/if}

<style>
  .scene-layout {
    min-height: calc(100vh - 76px);
    display: grid;
    grid-template-columns: minmax(0, 1fr) 330px;
  }

  .scene-column {
    min-width: 0;
    padding: 30px 32px 15px;
  }

  .scene-heading {
    max-width: 1060px;
    margin: auto;
    display: flex;
    align-items: end;
    justify-content: space-between;
  }

  .scene-heading h1 {
    margin-bottom: 17px;
    font: 800 clamp(34px, 4vw, 52px) / 1 var(--display);
  }

  .progress {
    font-family: var(--mono);
    text-align: right;
  }

  .progress strong {
    color: var(--acid);
    font-size: 32px;
  }

  .progress strong span {
    color: #819086;
    font-size: 15px;
  }

  .progress small {
    display: block;
    color: #849087;
    font-size: 8px;
    letter-spacing: 0.1em;
  }

  /*
   * The room is always 16:9 because evidence markers are placed as percentages
   * of the background picture. Changing the shape would slide every marker off
   * the thing it is pointing at.
   */
  .room {
    position: relative;
    width: min(1060px, 100%);
    aspect-ratio: 16 / 9;
    margin: 0 auto;
    overflow: hidden;
    border: 8px solid #29352d;
    box-shadow:
      inset 0 0 60px #0a0e0b8c,
      0 15px 30px #05080699;
  }

  .room-image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .scene-tape {
    position: absolute;
    z-index: 10;
    bottom: 4%;
    left: -4%;
    width: 110%;
    padding: 6px;
    background: #d5dc38;
    color: #1a201b;
    font: 700 10px var(--mono);
    letter-spacing: 0.12em;
    text-align: center;
    transform: rotate(-2deg);
  }

  .scene-help {
    max-width: 1060px;
    margin: 13px auto 0;
    color: #859187;
    font: 400 10px var(--mono);
  }

  .scene-help span {
    color: var(--acid);
  }

  @media (max-width: 900px) {
    .scene-layout {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 600px) {
    .scene-column {
      padding: 22px 10px 12px;
    }
  }
</style>
