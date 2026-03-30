<!-- src/components/layout/Header.vue -->
<template>
  <nav class="header" role="navigation" aria-label="Site header">
    <div class="header-container">
      <a class="header-logo" href="/" aria-label="AntiLink головна">AntiLink</a>
      <div class="header-buttons">
        <div class="profile-dropdown-wrapper">
          <button class="profile-settings" @click.stop="toggleDropdown">
            <img src="/assets/avatar.svg" alt="Мовні налаштування" />
          </button>

          <div v-if="langMenu" class="lang-menu">
            <div
              v-for="lang in languages"
              :key="lang.code"
              class="lang-item"
              :class="{ active: currentLang === lang.code }"
              @click="selectLanguage(lang.code)"
            >
              <span class="lang-flag">{{ lang.flag }}</span>
              <span class="lang-name">{{ lang.name }}</span>
              <span class="lang-short">{{ lang.short }}</span>
            </div>
          </div>
        </div>

        <a
          href="https://discord.gg/4gKnjwyWpK"
          class="header-link"
          target="_blank"
          rel="noopener"
        >
          {{ t('header.support') }}
        </a>
        <a href="/appeal" class="header-link">{{ t('header.appeal') }}</a>

        <div class="auth-section" aria-live="polite">
          <a v-if="!user" :href="oauthUrl" class="login-link">
            <button type="button" class="header-login-btn">
              <i class="fa-brands fa-discord" aria-hidden="true" />
              <span class="btn-text">{{ t('header.login') }}</span>
            </button>
          </a>

          <div v-else class="user-profile">
            <div
              class="user-avatar-wrapper"
              :aria-expanded="menuOpen"
              tabindex="0"
              @click.stop="toggleMenu"
              @keydown.enter.prevent="toggleMenu"
              @keydown.space.prevent="toggleMenu"
            >
              <img
                :src="userAvatar"
                alt="User Avatar"
                class="user-avatar"
                @error="handleAvatarError"
              />
            </div>

            <div
              v-if="menuOpen"
              class="user-dropdown-menu"
              role="menu"
              @keydown.esc="closeMenu"
            >
              <div class="user-info" role="none">
                <span class="username" role="presentation">{{
                  user.username
                }}</span>
              </div>
              <div class="dropdown-divider" role="separator" />
              <button
                class="dropdown-item"
                role="menuitem"
                @click="navigateToDashboard"
              >
                <i class="fas fa-server" aria-hidden="true" />
                {{ t('header.my_guilds') }}
              </button>
              <button
                v-if="isAdmin"
                class="dropdown-item"
                role="menuitem"
                @click="navigateToAdmin"
              >
                <i class="fa-solid fa-key" aria-hidden="true" /> Admin Panel
              </button>
              <button
                class="dropdown-item"
                role="menuitem"
                @click="navigateToBackups"
              >
                <i class="fas fa-solid fa-lock" aria-hidden="true" />
                {{ t('header.my_backups') }}
              </button>
              <button class="dropdown-item" role="menuitem" @click="logout">
                <i class="fas fa-sign-out-alt" aria-hidden="true" />
                {{ t('header.logout') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiFetch } from '@/api';

const { t, locale } = useI18n();

// Дані
const user = ref(null);
const menuOpen = ref(false);
const langMenu = ref(false);
const isAdmin = ref(false);
const defaultAvatar = 'https://cdn.discordapp.com/embed/avatars/0.png';
const languages = window.availableLanguages || [
  { code: 'uk', flag: '🇺🇦', name: 'Українська', short: 'UK' },
  { code: 'en', flag: '🇬🇧', name: 'English', short: 'EN' },
];

// Обчислювані властивості
const currentLang = computed(() => locale.value);
const userAvatar = computed(() => {
  if (!user.value) return defaultAvatar;
  return user.value.avatar
    ? `https://cdn.discordapp.com/avatars/${user.value.id}/${user.value.avatar}.png?size=80`
    : `https://cdn.discordapp.com/embed/avatars/${(user.value.discriminator || 0) % 5}.png`;
});

const oauthUrl =
  'https://discord.com/oauth2/authorize?client_id=1127967356879130724&response_type=code&redirect_uri=https%3A%2F%2Ftest.antilink.pp.ua%2Fauth%2Fdiscord&scope=identify+guilds';

// Методи
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
const toggleDropdown = () => {
  langMenu.value = !langMenu.value;
};
const closeMenu = () => {
  menuOpen.value = false;
};

const handleClickOutside = (event) => {
  const el = document.querySelector('.header');
  if (el && !el.contains(event.target)) {
    menuOpen.value = false;
    langMenu.value = false;
  }
};

const handleKeyDown = (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    closeMenu();
  }
};

const selectLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem('language', lang);
  langMenu.value = false;
};

const logout = async () => {
  try {
    const response = await apiFetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    if (response.ok) {
      user.value = null;
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const navigateToDashboard = () => {
  menuOpen.value = false;
  window.location.href = '/dashboard';
};

const navigateToAdmin = () => {
  window.location.href = '/admin';
};

const navigateToBackups = () => {
  menuOpen.value = false;
  window.location.href = '/backup';
};

const loadUser = async () => {
  try {
    const response = await apiFetch('/api/auth/user', {
      credentials: 'include',
    });
    if (response.ok) {
      user.value = await response.json();
    }
  } catch (error) {
    console.error('Failed to load user:', error);
  }
};

const checkAdminStatus = async () => {
  try {
    const res = await apiFetch('/admin/status');
    const data = await res.json();
    isAdmin.value = !!data.isAdmin;
  } catch (err) {
    console.error('Admin check failed:', err);
    isAdmin.value = false;
  }
};

const handleAvatarError = (event) => {
  event.target.src = defaultAvatar;
};

// Життєвий цикл
onMounted(() => {
  loadUser();
  checkAdminStatus();
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
@import '../../styles/headerStyles.css';
</style>
