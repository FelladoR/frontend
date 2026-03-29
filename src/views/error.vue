<template>
  <div class="error-page-layout">
    <header-component />

    <main class="main-content" role="main">
      <div class="container">
        <div class="error-wrapper">
          <div class="settings-card error-card" role="alert" aria-live="polite">
            <div class="error-icon">
              <i class="fas fa-exclamation-triangle" />
            </div>

            <div class="error-content">
              <h1 class="error-title">
                {{ t('error.title') || 'Виникла помилка' }}
              </h1>

              <p class="error-message">
                {{
                  message ||
                  'Щось пішло не так. Можливо, сторінка була видалена або сталася помилка на сервері.'
                }}
              </p>

              <div class="error-actions">
                <button
                  class="btn-back"
                  aria-label="Повернутися назад"
                  @click="goBack"
                >
                  <i class="fas fa-arrow-left" /> Назад
                </button>
                <a href="/" class="btn-home">На головну</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer-component />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useI18n } from 'vue-i18n';
import HeaderComponent from '@/components/layout/Header.vue';
import FooterComponent from '@/components/layout/Footer.vue';

const { t } = useI18n();

// Приймаємо текст помилки як prop
defineProps({
  message: {
    type: String,
    default: '',
  },
});

// Vue-спосіб повернутися назад
const goBack = () => {
  window.history.back();
};
</script>

<style scoped>
@import '../styles/error.css';
</style>
