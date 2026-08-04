<script lang="ts">
  import { untrack } from "svelte";
  import type { Container, EvidenceItem, PackageId } from "../lib/types";

  interface Props {
    item: EvidenceItem;
    /** Which containers this scene offers, in order. */
    offered: PackageId[];
    containers: Record<PackageId, Container>;
    /** What the student picked last time, if they are revisiting the item. */
    current?: PackageId;
    onpackage: (choice: PackageId) => void;
    onclose: () => void;
  }

  let { item, offered, containers, current, onpackage, onclose }: Props = $props();

  let dialog = $state<HTMLDialogElement>();
  // Start on the student's previous answer. A fresh dialog is built each time an
  // item is opened, so this only ever needs to read `current` once.
  let choice = $state<PackageId | undefined>(untrack(() => current));

  // Opening it with showModal() is what gives us focus trapping, Escape to
  // close, and an inert background for free, straight from the browser.
  $effect(() => {
    dialog?.showModal();
  });

  function closeOnBackdropClick(event: MouseEvent) {
    if (event.target === dialog) onclose();
  }
</script>

<dialog bind:this={dialog} onclose={onclose} onclick={closeOnBackdropClick} aria-labelledby="modal-title">
  <div class="modal">
    <button class="modal-close" onclick={onclose} aria-label="Close">×</button>

    <div class="evidence-preview">
      <img src={item.image} alt={item.alt} />
      <b>EVIDENCE<br />{item.number}</b>
    </div>

    <div class="modal-content">
      <p class="eyebrow">Examine item</p>
      <h2 id="modal-title">{item.name}</h2>
      <p class="item-description">{item.description}</p>

      <div class="field-note">
        <strong>FIELD OBSERVATION</strong>
        <span>Select the safest packaging for transport.</span>
      </div>

      <fieldset>
        <legend>CHOOSE A CONTAINER</legend>
        {#each offered as id (id)}
          <label class="package-choice" class:chosen={choice === id}>
            <input type="radio" name="package" value={id} bind:group={choice} />
            <span class="package-icon">{containers[id].icon}</span>
            <span>
              <strong>{containers[id].label}</strong>
              <small>{containers[id].detail}</small>
            </span>
            <i>{choice === id ? "●" : "○"}</i>
          </label>
        {/each}
      </fieldset>

      <button
        class="primary-button full"
        disabled={!choice}
        onclick={() => choice && onpackage(choice)}
      >
        {current ? "UPDATE EVIDENCE LOG" : "ADD TO EVIDENCE LOG"} <b>→</b>
      </button>
      <p class="delayed-note">Results stay sealed until the evidence reaches the lab.</p>
    </div>
  </div>
</dialog>

<style>
  dialog {
    width: min(760px, 100%);
    max-width: 100%;
    max-height: calc(100vh - 30px);
    padding: 0;
    border: 0;
    background: transparent;
    overflow: visible;
  }

  dialog::backdrop {
    background: #050806d9;
    backdrop-filter: blur(4px);
  }

  .modal {
    display: grid;
    grid-template-columns: 34% 66%;
    max-height: calc(100vh - 30px);
    overflow: auto;
    position: relative;
    color: var(--ink);
    background: var(--paper);
    box-shadow: 16px 16px 0 #0008;
  }

  .modal-close {
    position: absolute;
    right: 13px;
    top: 8px;
    border: 0;
    background: none;
    color: #576057;
    font: 32px var(--display);
    cursor: pointer;
  }

  .evidence-preview {
    position: relative;
    min-height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #253129;
    border-right: 7px solid var(--acid);
  }

  .evidence-preview img {
    width: 55%;
    filter: drop-shadow(8px 10px 5px #0006);
  }

  .evidence-preview > b {
    position: absolute;
    left: 16px;
    bottom: 16px;
    color: var(--acid);
    font: 600 11px var(--mono);
  }

  .modal-content {
    padding: 35px 35px 25px;
  }

  .modal-content h2 {
    margin-bottom: 5px;
    font: 800 38px var(--display);
    text-transform: uppercase;
  }

  .item-description {
    color: #535b53;
    font-size: 14px;
  }

  .field-note {
    display: flex;
    flex-direction: column;
    margin: 18px 0;
    padding: 10px 13px;
    background: #d4cebd;
    border-left: 4px solid #6c766c;
  }

  .field-note strong,
  fieldset legend {
    font: 600 8px var(--mono);
    letter-spacing: 0.12em;
  }

  .field-note span {
    margin-top: 3px;
    font-size: 12px;
  }

  fieldset {
    margin: 0 0 19px;
    padding: 0;
    border: 0;
  }

  fieldset legend {
    margin-bottom: 8px;
  }

  .package-choice {
    display: grid;
    grid-template-columns: 47px 1fr 22px;
    align-items: center;
    margin-bottom: 7px;
    padding: 8px 12px;
    border: 1px solid #a29f92;
    cursor: pointer;
  }

  .package-choice input {
    position: absolute;
    opacity: 0;
  }

  .package-choice.chosen {
    padding: 7px 11px;
    border: 2px solid #3d5842;
    background: #dce0cf;
  }

  .package-choice.chosen i {
    color: #3e603e;
  }

  .package-choice i {
    font-style: normal;
  }

  .package-icon {
    color: #6d766c;
    font-size: 29px;
  }

  .package-choice strong,
  .package-choice small {
    display: block;
  }

  .package-choice strong {
    font: 600 14px var(--display);
  }

  .package-choice small {
    color: #777b73;
    font: 400 8px var(--mono);
  }

  .delayed-note {
    margin: 10px 0 0;
    color: #747a72;
    font: 400 8px var(--mono);
    text-align: center;
  }

  @media (max-width: 600px) {
    .modal {
      grid-template-columns: 1fr;
    }

    .evidence-preview {
      min-height: 135px;
      border-right: 0;
      border-bottom: 5px solid var(--acid);
    }

    .evidence-preview img {
      width: 90px;
      margin: 12px 0;
    }

    .modal-content {
      padding: 25px 20px 20px;
    }
  }
</style>
