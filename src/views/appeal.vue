<template>
  <header-component />

  <main class="main-content">
    <div class="appeal-container">
      <div class="appeal-header">
        <h1>{{ t('appeal.main_title') }}</h1>
        <p>{{ t('appeal.main_description') }}</p>
      </div>

      <form class="appeal-form" @submit.prevent="submitForm">
        <div class="form-group">
          <label class="form-label">{{
            t('appeal.form.title_discord_id')
          }}</label>
          <input type="text" class="form-control" :value="userId" disabled />
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('appeal.form.punish_date') }}</label>
          <input v-model="form.warnDate" type="date" class="form-control" />
          <div v-if="errors.warnDate" class="error-message">
            {{ errors.warnDate }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('appeal.form.reason') }}</label>
          <textarea
            v-model="form.reason"
            class="form-control"
            rows="4"
            :placeholder="t('appeal.form.reason_desc')"
          />
          <div v-if="errors.reason" class="error-message">
            {{ errors.reason }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('appeal.form.moderator') }}</label>
          <input
            v-model="form.issuer"
            type="text"
            class="form-control"
            :placeholder="t('appeal.form.moderator_desc')"
          />
          <div v-if="errors.issuer" class="error-message">
            {{ errors.issuer }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label"> {{ t('appeal.form.mistake') }}</label>
          <textarea v-model="form.understood" class="form-control" rows="4" />
          <div v-if="errors.understood" class="error-message">
            {{ errors.understood }}
          </div>
        </div>

        <div
          class="cf-turnstile"
          data-sitekey="0x4AAAAAABlvMqbKySTZKHqS"
          data-callback="onCaptchaSuccessCallback"
        />

        <button type="submit" class="submit-btn" :disabled="!captchaPassed">
          <i class="fas fa-paper-plane" />
          {{ t('appeal.button_send') }}
        </button>
      </form>
    </div>
  </main>

  <footer-component />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import HeaderComponent from '@/components/layout/Header.vue';
import FooterComponent from '@/components/layout/Footer.vue';
import { apiFetch } from '@/api';

const { t } = useI18n();

// Стан
const user = ref(null);
const errors = ref({});
const captchaPassed = ref(false);
const captchaToken = ref('');
const turnstileContainer = ref(null);
let turnstileWidgetId = null;

const form = ref({
  warnDate: '',
  reason: '',
  issuer: '',
  understood: '',
});

// Обчислювані
const userId = computed(() => user.value?.id || '');

// Функція для капчі
const onCaptchaSuccess = (token) => {
  console.log('Captcha успішно пройдена, token:', token);
  captchaPassed.value = true;
  captchaToken.value = token;
};

// Ініціалізація капчі
const initTurnstile = () => {
  if (typeof turnstile !== 'undefined' && turnstileContainer.value) {
    turnstileWidgetId = turnstile.render(turnstileContainer.value, {
      sitekey: '0x4AAAAAABlvMqbKySTZKHqS',
      callback: onCaptchaSuccess,
    });
  } else if (typeof turnstile === 'undefined') {
    console.warn('Turnstile не завантажено, чекаємо...');
    // Якщо turnstile ще не завантажився, чекаємо
    const checkTurnstile = setInterval(() => {
      if (typeof turnstile !== 'undefined' && turnstileContainer.value) {
        clearInterval(checkTurnstile);
        initTurnstile();
      }
    }, 100);
  }
};

// Скидання капчі
const resetCaptcha = () => {
  captchaPassed.value = false;
  captchaToken.value = '';
  if (typeof turnstile !== 'undefined' && turnstileWidgetId) {
    turnstile.reset(turnstileWidgetId);
  }
};

// Валідація
const validateForm = () => {
  errors.value = {};

  if (!form.value.warnDate) {
    errors.value.warnDate = t('appeal.errors.date_required');
  }

  if (!form.value.reason || form.value.reason.length < 10) {
    errors.value.reason = t('appeal.errors.reason_min');
  } else if (form.value.reason.length > 500) {
    errors.value.reason = t('appeal.errors.reason_max');
  }

  if (!form.value.issuer || form.value.issuer.length < 3) {
    errors.value.issuer = t('appeal.errors.issuer_min');
  }

  if (!form.value.understood || form.value.understood.length < 10) {
    errors.value.understood = t('appeal.errors.understood_min');
  }

  return Object.keys(errors.value).length === 0;
};

// Очищення форми
const resetForm = () => {
  form.value = {
    warnDate: '',
    reason: '',
    issuer: '',
    understood: '',
  };
  resetCaptcha();
};

// Відправка форми
const submitForm = async () => {
  if (!captchaPassed.value) {
    alert(t('appeal.errors.captcha_required'));
    return;
  }

  if (!validateForm()) {
    return;
  }

  try {
    const response = await apiFetch('/api/application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...form.value,
        user_id: userId.value,
        captchaToken: captchaToken.value,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Помилка:', errorData);
      alert(t('appeal.errors.submit_error'));
      return;
    }

    await response.json();
    alert(t('appeal.success_message'));

    setTimeout(() => {
      window.history.back();
    }, 1000);

    resetForm();
  } catch (err) {
    console.error('Запит не вдався:', err);
    alert(t('appeal.errors.server_error'));
  }
};

// Завантаження користувача
const loadUser = async () => {
  try {
    const res = await apiFetch('/api/user');
    if (res.ok) {
      user.value = await res.json();
      console.log('Користувач завантажений:', user.value);
    } else {
      console.error('Не вдалося завантажити користувача:', res.status);
    }
  } catch (error) {
    console.error('Помилка завантаження користувача:', error);
  }
};

// Додаємо скрипт Turnstile, якщо його немає
const loadTurnstileScript = () => {
  if (!document.querySelector('script[src*="turnstile"]')) {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Turnstile скрипт завантажено');
      initTurnstile();
    };
    document.head.appendChild(script);
  } else {
    initTurnstile();
  }
};

onMounted(() => {
  loadUser();
  loadTurnstileScript();
});

onUnmounted(() => {
  // Очищення при розмонтуванні
  if (turnstileWidgetId && typeof turnstile !== 'undefined') {
    turnstile.remove(turnstileWidgetId);
  }
});

// Глобальна функція для капчі (для зворотного виклику)
if (typeof window !== 'undefined') {
  window.onCaptchaSuccessCallback = onCaptchaSuccess;
}
</script>

<style scoped>
@import '../styles/appeal.css';
</style>
