<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Гільдії</title>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
  />
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
  />
  <link rel="stylesheet" href="/src/styles/dashboard.css" />

  <div id="preloader">
    <div class="preloader-spinner" />
  </div>

  <div v-cloak id="app">
    <header-component />

    <div class="main-content">
      <div class="container">
        <div v-if="user">
          <div class="text-center mb-4">
            <h2 class="mb-1">
              {{ t('dashboard.main_title') }}{{ user.username }}
            </h2>
            <h5 class="text-muted">
              {{ t('dashboard.main_desc') }}
            </h5>
          </div>

          <div v-if="processedGuilds && processedGuilds.length > 0">
            <div class="row g-3">
              <div
                v-for="guild in processedGuilds"
                :key="guild.id"
                class="col-12"
              >
                <div
                  class="d-flex align-items-center justify-content-between p-3 guild-card"
                >
                  <div class="d-flex align-items-center gap-3">
                    <img
                      v-if="guild.icon"
                      :src="`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`"
                      class="guild-icon"
                      :alt="guild.name"
                    />
                    <img
                      v-else
                      src="https://cdn.discordapp.com/embed/avatars/0.png"
                      class="guild-icon"
                      :alt="guild.name"
                    />
                    <div>
                      <span class="guild-name">{{ guild.name }}</span>
                      <div class="guild-sub">ID: {{ guild.id }}</div>
                    </div>
                  </div>

                  <div class="guild-actions d-flex align-items-center">
                    <button
                      :class="[
                        'btn btn-sm',
                        {
                          'btn-success add-btn':
                            !guild.botAdded && !guild.loading,
                        },
                        {
                          'btn-outline-primary':
                            guild.botAdded && !guild.loading,
                        },
                        { 'btn-secondary': guild.loading },
                      ]"
                      :disabled="guild.loading"
                      :aria-label="
                        guild.loading
                          ? 'Перевірка сервера'
                          : guild.botAdded
                            ? 'Налаштувати сервер'
                            : 'Додати бота'
                      "
                      @click="handleGuildAction(guild, $event)"
                    >
                      <span
                        v-if="guild.loading"
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      {{
                        guild.loading
                          ? t('dashboard.guild_loading.checking')
                          : guild.botAdded
                            ? t('dashboard.guild_loading.setup')
                            : t('dashboard.guild_loading.add')
                      }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center">
            <div
              class="alert alert-info d-inline-flex align-items-center gap-2"
              role="status"
            >
              <i class="fa-regular fa-face-sad fa-lg" />
              <div>
                {{ t('dashboard.no_servers') }}
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Завантаження...</span>
          </div>
          <p class="mt-2">Завантаження даних...</p>
        </div>
      </div>
    </div>
    <footer-component />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import HeaderComponent from '@/components/layout/Header.vue';
import FooterComponent from '@/components/layout/Footer.vue';
import { useI18n } from 'vue-i18n'; // 1. Імпортуємо модуль перекладу
import { apiFetch } from '@/api';

const user = ref(null);
const loading = ref(null);
const guildWithBot = ref(null);
const initialized = ref(null);
const error = ref(null);

const { t } = useI18n();
const processedGuilds = computed(() => {
  if (!user.value.ownerGuilds) return [];

  return user.value.ownerGuilds.map((guild) => ({
    ...guild,
    botAdded: guildWithBot.value.includes(guild.id),
    loading: !initialized.value,
  }));
});

async function checkBotPresence(guildId) {
  try {
    const response = await apiFetch(`/api/bot/has-bot/${guildId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.hasBot;
  } catch (error) {
    console.error('Error checking bot presence:', error);
    return false;
  }
}
async function handleGuildAction(guild, event) {
  // Запобігаємо дії за замовчуванням (якщо кнопка в формі)
  if (event) event.preventDefault();
  try {
    if (guild.loading) return; // Не робимо нічого, якщо йде завантаження

    if (guild.botAdded) {
      // Відкриваємо налаштування в поточній вкладці
      window.location.assign(`/guild/${guild.id}/settings`);
    } else {
      // Відкриваємо OAuth у новій вкладці
      const inviteUrl = `https://discord.com/oauth2/authorize?client_id=1127967356879130724&permissions=8&scope=bot&guild_id=${guild.id}`;
      window.open(inviteUrl, '_blank', 'noopener,noreferrer');
    }
  } catch (error) {
    console.error('Помилка при обробці гільдії:', error);
    // Можна додати сповіщення про помилку
    alert('Сталася помилка. Будь ласка, спробуйте ще раз.');
  }
}

async function loadUserData() {
  try {
    loading.value = true;
    initialized.value = false;
    error.value = null;

    const userRes = await apiFetch('/api/user', {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!userRes.ok) throw new Error('Не вдалося завантажити дані користувача');

    const userData = await userRes.json();

    user.value = userData;
    // Очищаємо попередні результати
    guildWithBot.value = [];

    // Використовуємо Promise.allSettled для стабільності
    const checks = await Promise.allSettled(
      user.value.ownerGuilds.map((guild) =>
        checkBotPresence(guild.id).then((hasBot) => {
          if (hasBot) {
            guildWithBot.value.push(guild.id);
          }
        })
      )
    );

    // Перевіряємо помилки
    const errors = checks.filter((r) => r.status === 'rejected');
    if (errors.length > 0) {
      console.error('Деякі перевірки завершилися з помилкою:', errors);
    }
  } catch (error) {
    console.error('Помилка завантаження:', error);
    error.value = error.message;
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  } finally {
    loading.value = false;
    initialized.value = true;
  }
}

onMounted(() => {
  document.body.classList.add('vue-loading');
});
nextTick(() => {
  loadUserData().finally(() => {
    document.body.classList.remove('vue-loading');
    document.body.classList.add('vue-loaded');
  });
});
</script>
