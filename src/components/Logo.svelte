<script lang="ts">
  /*
   * The Evidence Room mark: a fingerprint ridge flow, tilted slightly off square.
   * It draws in `currentColor`, so the parent sets the colour.
   *
   * The same shape is in public/fingerprint-mark.svg, and in public/favicon.svg
   * over a dark tile. Change one and change the others.
   *
   * The ridges sit inside the 64 viewBox with room to spare (they span about 36
   * across and 44 down), so `size` is the box, not the visible mark.
   */

  interface Props {
    /** Width and height in pixels. */
    size?: number;
  }

  let { size = 52 }: Props = $props();
</script>

<svg
  viewBox="0 0 64 64"
  width={size}
  height={size}
  fill="none"
  stroke="currentColor"
  aria-hidden="true"
>
  <g stroke-width="3.4" stroke-linecap="round" transform="rotate(-4 32 32)">
    <path d="M25.29 50.40A16.50 20.80 0 1 1 38.71 50.40" />
    <path d="M27.66 44.41A10.80 14.00 0 1 1 34.69 44.26" />
    <path
      d="M29.06 32.99L28.95 32.91L28.84 32.82L28.73 32.72L28.63 32.62L28.53 32.50L28.43 32.38L28.34 32.25L28.25 32.11L28.17 31.97L28.10 31.81L28.02 31.66L27.96 31.49L27.90 31.32L27.85 31.14L27.80 30.96L27.77 30.78L27.74 30.59L27.71 30.39L27.70 30.19L27.69 29.99L27.69 29.79L27.70 29.59L27.72 29.39L27.75 29.18L27.78 28.98L27.83 28.78L27.88 28.58L27.94 28.38L28.01 28.18L28.09 27.99L28.17 27.80L28.27 27.62L28.37 27.44L28.48 27.26L28.60 27.10L28.73 26.94L28.86 26.79L29.00 26.65L29.15 26.51L29.30 26.39L29.46 26.27L29.63 26.17L29.80 26.07L29.97 25.99L30.16 25.92L30.34 25.86L30.53 25.81L30.72 25.78L30.91 25.76L31.11 25.75L31.30 25.76L31.50 25.78L31.70 25.81L31.90 25.86L32.09 25.92L32.29 25.99L32.48 26.08L32.67 26.18L32.86 26.30L33.04 26.42L33.22 26.57L33.40 26.72L33.57 26.89L33.73 27.07L33.89 27.26L34.04 27.47L34.18 27.68L34.32 27.91L34.44 28.15L34.56 28.39L34.67 28.65L34.77 28.92L34.85 29.19L34.93 29.47L35.00 29.75L35.05 30.05L35.10 30.34L35.13 30.65L35.15 30.95L35.15 31.26L35.15 31.57L35.13 31.88L35.10 32.19L35.06 32.50L35.00 32.81L34.93 33.12L34.85 33.42L34.76 33.72L34.65 34.01L34.53 34.30L34.40 34.58L34.26 34.86L34.10 35.12L33.94 35.37L33.76 35.62L33.58 35.85L33.38 36.08L33.17 36.28L32.95 36.48L32.73 36.66L32.50 36.83L32.26 36.98L32.01 37.12L31.75 37.24L31.49 37.34L31.23 37.43L30.96 37.50L30.68 37.55L30.41 37.58L30.13 37.59"
    />
  </g>
</svg>

<style>
  svg {
    display: block;
  }
</style>
