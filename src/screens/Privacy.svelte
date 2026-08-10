<script lang="ts">
  import InfoPage from "../components/InfoPage.svelte";
</script>

<InfoPage
  eyebrow="Forensic training unit"
  title="PRIVACY"
  lead="What we collect, what we don't, and why."
>
  <section class="info-card">
    <p>
      Evidence Room does not collect personal information from visitors or students. We use
      Cloudflare Web Analytics to anonymously count the number of visits, which helps us understand
      how Evidence Room is being used in classrooms. Cloudflare Web Analytics is cookieless, does not
      fingerprint visitors, and does not track users across other sites. See Cloudflare's
      <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
        privacy policy
      </a>
      for details. We do not share, sell, or otherwise transfer any visitor data to third parties.
      Evidence Room keeps your progress through a case in the page itself: nothing is saved to your
      device, and reloading the page simply starts a fresh case.
    </p>
    <p class="follow-up">
      Questions or concerns? Email
      <a href="mailto:support@forensicsimulator.com?subject=evidenceroom%20privacy">
        support@forensicsimulator.com
      </a>.
    </p>
  </section>
</InfoPage>

<style>
  .follow-up {
    margin-top: 18px;
  }
</style>
