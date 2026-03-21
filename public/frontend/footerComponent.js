export default {
  template: `
    <link rel="stylesheet" href="/styles/footerComponent.css">
      <footer class="main-footer" role="contentinfo">
        <!-- TOP ROW -->
        <div class="footer-top">
          <div class="footer-top-inner">
            <div class="footer-left">
              <div class="footer-logo">
                <i class="fas fa-shield-alt"></i>
                <span>Antilink</span>
              </div>
              <div class="footer-copy">© {{ currentYear }} Antilink</div>
            </div>

            <nav class="footer-links">
              <a href="/docs">{{ $t('hero.docs') }}</a>
              <a href="https://discord.gg/4gKnjwyWpK" target="_blank">{{ $t('header.support' )}}</a>
              <a href="/terms">{{ $t('footer.temps') }}</a>
              <a href="/privacy">{{ $t('footer.privacy') }}</a>
            </nav>
          </div>
        </div>

        <!-- BOTTOM ROW -->
        <div class="footer-bottom">
          <div class="footer-bottom-inner">
            {{ $t('footer.rights') }}
          </div>
        </div>
      </footer>

  `,

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
};
