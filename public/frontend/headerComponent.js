import { apiFetch } from "./utils/api.js";

export default {
  template: `
      <nav class="header" role="navigation" aria-label="Site header">
        <div class="header-container">
        <link rel="stylesheet" href="/styles/headerStyles.css">
          <a class="header-logo" href="/" aria-label="AntiLink головна">AntiLink</a>
          <div class="header-buttons">
            <div class="profile-dropdown-wrapper">
              <button class="profile-settings" @click.stop="toggleDropdown">
                <img src="/assets/avatar.svg" alt="Мовні налаштування">
              </button>
              
              <!-- Мовне меню тепер абсолютно позиціоноване -->
              <div v-if="langMenu" class="lang-menu">
                <div v-for="lang in languages" 
                    :key="lang.code" 
                    class="lang-item"
                    :class="{ active: currentLang === lang.code }"
                    @click="selectLanguage(lang.code)">
                  <span class="lang-flag">{{ lang.flag }}</span>
                  <span class="lang-name">{{ lang.name }}</span>
                  <span class="lang-short">{{ lang.short }}</span>
                </div>
              </div>
          </div>

            <a href="https://discord.gg/4gKnjwyWpK" class="header-link" target="_blank" rel="noopener">{{  $t('header.support') }}</a>
            <a href="/appeal" class="header-link">{{ $t('header.appeal') }}</a>
            
            <div class="auth-section" aria-live="polite">
              <a v-if="!user" 
                 :href="oauthUrl" 
                 class="login-link">
                <button type="button" class="header-login-btn">
                  <i class="fa-brands fa-discord" aria-hidden="true"></i>
                  <span class="visually-hidden">{{ $t('header.login_via_discord') }}</span>
                  <span class="btn-text">{{ $t('header.login') }}</span>
                </button>
              </a>
              
              <div v-else class="user-profile">
                <div class="user-avatar-wrapper" @click.stop="toggleMenu" :aria-expanded="menuOpen" tabindex="0" @keydown.enter.prevent="toggleMenu" @keydown.space.prevent="toggleMenu">
                  <img :src="userAvatar" 
                       alt="User Avatar" 
                       class="user-avatar"
                       @error="handleAvatarError">
                </div>

                <div v-if="menuOpen" class="user-dropdown-menu" role="menu" @keydown.esc="closeMenu">
                  <div class="user-info" role="none">
                    <span class="username" role="presentation">{{ user.username }}</span>
                  </div>
                  <div class="dropdown-divider" role="separator"></div>
                  <button @click="navigateToDashboard" class="dropdown-item" role="menuitem">
                    <i class="fas fa-server" aria-hidden="true"></i> {{ $t('header.my_guilds') }}
                  </button>
                  <button
                  v-if="isAdmin"
                  @click="navigateToAdmin" class="dropdown-item" role="menuitem">
                    <i class="fa-solid fa-key" aria-hidden="true"></i> Admin Panel
                  </button>
                  <button @click="navigateToBackups" class="dropdown-item" role="menuitem">
                    <i class="fas fa-solid fa-lock" aria-hidden="true"></i> {{ $t('header.my_backups') }}
                  </button>
                  <button @click="logout" class="dropdown-item" role="menuitem">
                    <i class="fas fa-sign-out-alt" aria-hidden="true"></i> {{ $t('header.logout') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    `,
  data() {
    return {
      user: null,
      menuOpen: false,
      defaultAvatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
      langMenu: false,
      languages: window.availableLanguages,
      isAdmin: false,
    };
  },
  computed: {


    currentLang() {
      return this.$i18n.locale;
    },
    userAvatar() {
      if (!this.user) return this.defaultAvatar;
      return this.user.avatar
        ? `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png?size=80`
        : `https://cdn.discordapp.com/embed/avatars/${(this.user.discriminator || 0) % 5}.png`;
    },
    oauthUrl() {
      return 'https://discord.com/oauth2/authorize?client_id=1127967356879130724&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fdiscord&scope=identify+guilds';
    }
  },
  async mounted() {
    
    this.loadUser();
    document.addEventListener('click', this.handleClickOutside);
    document.addEventListener('keydown', this.handleKeyDown);
    this.checkAdminStatus(); 
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {

    async checkAdminStatus() {
      try {
        const res = await apiFetch('/admin/status');
        
        const data = await res.json(); 
        
        console.log("Admin check response:", data);
        this.isAdmin = !!data.isAdmin; // Оновлюємо реактивну змінну в data
      } catch (err) {
        console.error("Admin check failed:", err);
        this.isAdmin = false;
      }
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    toggleDropdown() {
      console.log("Бачу спробу закрити кнопку!")
      this.langMenu = !this.langMenu;

    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.menuOpen = false;
        this.langMenu = false;
      }
    },

    selectLanguage(lang) {
      this.$i18n.locale = lang;
      localStorage.setItem("language", lang);
      this.langMenu = false;
    },

    closeMenu() {
      this.menuOpen = false;
    },
    handleKeyDown(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        this.closeMenu();
      }
    },
    async logout() {
      try {
        const response = await apiFetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          this.user = null;
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
    navigateToDashboard() {
      this.menuOpen = false;
      window.location.href = '/dashboard';
    },
    navigateToAdmin() {
      window.location.href = '/admin/admin'
    },
    navigateToBackups() {
      this.menuOpen = false;
      window.location.href = '/backup';
    },
    async loadUser() {
      try {
        const response = await apiFetch('/api/auth/user', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const userData = await response.json();
          this.user = userData;
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    },
    handleAvatarError(event) {
      event.target.src = this.defaultAvatar;
    },
  },
};