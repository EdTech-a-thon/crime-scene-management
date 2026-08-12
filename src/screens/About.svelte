<script lang="ts">
  import participants from "../assets/2026participants.jpg";
  import edtechathonLogo from "../assets/logo.svg";
  import InfoPage from "../components/InfoPage.svelte";
</script>

<InfoPage
  eyebrow="Forensic training unit"
  title="ABOUT"
  lead="A classroom-friendly crime scene simulation built for teachers and their students."
>
  <section class="info-card">
    <h2><img class="card-logo" src={edtechathonLogo} alt="" /> From the EdTech-a-thon</h2>
    <p>
      Evidence Room is a project from the
      <a href="https://edtechathon.com" target="_blank" rel="noopener noreferrer">EdTech-a-thon</a>, a
      community of builders making free tools for classrooms. Learn more about who we are and what
      else we're building at
      <a href="https://edtechathon.com" target="_blank" rel="noopener noreferrer">edtechathon.com</a>.
    </p>

    <figure class="photo">
      <img src={participants} alt="Participants of the 2026 EdTech-a-thon" />
      <figcaption>EdTech-a-thon 2026</figcaption>
    </figure>
  </section>

  <section class="info-card">
    <h2>Our promise</h2>
    <ul class="promise">
      <li><strong>Zero paywalls.</strong></li>
      <li><strong>Zero ads.</strong></li>
      <li><strong>Zero tracking of personal data.</strong></li>
    </ul>
  </section>

  <section class="info-card">
    <h2>Feedback &amp; ideas</h2>
    <p>
      We'd love to hear from you. Tell us what's working, what's not, or pitch us an idea for a tool
      you wish existed. We're here to help.
    </p>
    <a
      class="primary-button email-button"
      href="mailto:support@forensicsimulator.com?subject=evidenceroom%20feedback"
    >
      EMAIL SUPPORT@FORENSICSIMULATOR.COM
    </a>
  </section>
</InfoPage>

<style>
  .card-logo {
    width: 40px;
    height: 40px;
    margin-right: 12px;
    vertical-align: -12px;
  }

  /* The team photo, pinned into the case file like a scene photograph. */
  .photo {
    width: min(460px, 100%);
    margin: 34px auto 4px;
    padding: 12px 12px 6px;
    background: #f4f1e8;
    box-shadow: 5px 6px 0 #4d493e33;
    transform: rotate(-1deg);
  }

  .photo img {
    display: block;
    width: 100%;
    background: #d7d0be;
  }

  figcaption {
    padding: 14px 0 10px;
    color: #3a433c;
    font: 400 19px "Segoe Script", "Bradley Hand", "Snell Roundhand", cursive;
    text-align: center;
  }

  .promise {
    margin: 0;
    padding-left: 20px;
  }

  .promise li {
    margin-bottom: 6px;
  }

  .email-button {
    display: inline-flex;
    align-items: center;
    margin-top: 18px;
    color: var(--forest);
    text-decoration: none;
  }
</style>
