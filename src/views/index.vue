<template>
  <div class="antilink-home">
    <div class="background-wrap">
      <div class="stars" />
      <div class="twinkling" />
    </div>
    <header-component />
    <main class="main-content">
      <section class="hero">
        <div class="hero-content container">
          <h1>Antilink</h1>
          <p class="subtitle">
            {{ t('hero.description') }}
          </p>
          <div class="cta-buttons">
            <a href="#" class="btn primary-btn">
              <i class="fab fa-discord" /> {{ t('hero.link_to_add') }}
            </a>
            <a href="/docs" class="btn secondary-btn">{{ t('hero.docs') }}</a>
          </div>
        </div>
        <div class="hero-image">
          <img src="/assets/images/antilink-logo.png" alt="Antilink Logo" />
        </div>
      </section>

      <section class="features-container container">
        <h2>{{ t('stats.title') }}</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-shield-alt" />
            </div>
            <h3>{{ t('stats.verification_title') }}</h3>
            <p>{{ t('stats.verification_desc') }}</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-link" />
            </div>
            <h3>{{ t('stats.invitesblock_title') }}</h3>
            <p>{{ t('stats.invitesblock_desc') }}</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-user-secret" />
            </div>
            <h3>{{ t('stats.blacklist_title') }}</h3>
            <p>{{ t('stats.blacklist_desc') }}</p>
          </div>
        </div>
      </section>

      <section class="stats-section container">
        <div class="stat-item">
          <div class="stat-number">
            {{ formattedGuilds || '1 128' }}
          </div>
          <div class="stat-label">
            {{ t('stats.active_guilds') }}
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-number">99.9%</div>
          <div class="stat-label">
            {{ t('stats.efficiency') }}
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-number">24/7</div>
          <div class="stat-label">
            {{ t('stats.online_support') }}
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-number">
            {{ formattedMembers || '306 107' }}
          </div>
          <div class="stat-label">
            {{ t('stats.members') }}
          </div>
        </div>
      </section>
    </main>
    <footer-component />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import HeaderComponent from '@/components/layout/Header.vue';
import FooterComponent from '@/components/layout/Footer.vue';
import { apiFetch } from '@/api';

const { t } = useI18n();
const guilds = ref(1128);
const members = ref(306107);

const formattedGuilds = computed(() => {
  return guilds.value.toLocaleString('uk-UA');
});

const formattedMembers = computed(() => {
  return members.value.toLocaleString('uk-UA');
});

async function fetchBotStats() {
  try {
    const response = await apiFetch('/api/bot/stats');
    if (response.ok) {
      const res = await response.json();
      if (res && res.status === 'success') {
        guilds.value = res.guilds || 1128;
        members.value = res.members || 306107;
      }
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
}

onMounted(() => {
  fetchBotStats();
});
</script>

<style scoped>
@import '../styles/index.css';
</style>
