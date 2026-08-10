<script lang="ts">
  import edtechathonLogo from "../assets/logo.svg";
  import Link from "./Link.svelte";
</script>

<footer class="footer no-print">
  <a class="credit" href="https://edtechathon.com" target="_blank" rel="noopener noreferrer">
    <img src={edtechathonLogo} alt="" />
    Built by the EdTech-a-thon
  </a>
  <Link href="/about" class="footer-link">about</Link>
  <Link href="/privacy" class="footer-link">privacy</Link>
</footer>

<style>
  .footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 8px 22px;
    padding: 18px 20px 22px;
    background: #0d1511;
    border-top: 1px solid #ffffff1f;
    font: 500 11px var(--mono);
    letter-spacing: 0.08em;
    text-align: center;
  }

  .credit {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .credit img {
    width: 22px;
    height: 22px;
  }

  .footer :global(a) {
    color: #9da89f;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .footer :global(a:hover) {
    color: var(--acid);
  }

  .footer :global(.footer-link) {
    text-transform: uppercase;
  }
</style>
