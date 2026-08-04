import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// Lets us write <script lang="ts"> inside .svelte files.
export default { preprocess: vitePreprocess() };
