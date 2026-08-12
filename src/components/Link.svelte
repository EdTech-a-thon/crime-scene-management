<script lang="ts">
  import type { Snippet } from "svelte";
  import { navigate } from "../lib/router.svelte";

  interface Props {
    href: string;
    /** Extra classes from the page, so each one can style its own links. */
    class?: string;
    children: Snippet;
  }

  let { href, class: className = "", children }: Props = $props();

  // A real <a> with a real href, so the link can still be copied or opened in a
  // new tab. Only a plain left click is handled in the page.
  function onclick(event: MouseEvent) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    navigate(href);
  }
</script>

<a {href} {onclick} class={className}>{@render children()}</a>
