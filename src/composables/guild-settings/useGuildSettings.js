import { ref, computed } from 'vue';
import { apiFetch } from '@/api';
import { startLoadingMessages } from '../../views/guild.vue';

export function useGuildSettings(guildId) {
  // Стан даних сервера
  const guild = ref(null);
  const channels = ref([]);
  const roles = ref([]);
  const webhooks = ref([]);
  const isLoading = ref(true);

  const loadingMessage = ref('Завантаження даних сервера...');
  const loadingMessages = [
    'Завантаження даних сервера...',
    'Отримання налаштувань...',
    'Синхронізація з Discord...',
    'Майже готово...',
  ];
  let messageInterval = null;

  const startLoadingMessages = () => {
    let index = 0;
    messageInterval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      loadingMessage.value = loadingMessages[index];
    }, 2000);
  };

  // Стан налаштувань
  const mainSettings = ref({ language: 'uk', antiRaid: false, autoMod: false });
  const loggingSettings = ref({ webhookId: null, messageDelete: true });
  const verificationSettings = ref({
    verifiedRole: null,
    unverifiedRole: null,
    verificationChannel: null,
    captchaEnabled: false,
  });
  const whitelistRoles = ref([]);

  // Обчислювані властивості
  const availableRoles = computed(() =>
    roles.value.filter((r) => !r.managed && r.name !== '@everyone')
  );
  const textChannels = computed(() =>
    channels.value.filter((c) => c.type === 0)
  );

  async function loadGuildData(onError) {
    try {
      const response = await apiFetch(`/api/guild/${guildId}/all-settings`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Текст помилки:', errorText);
        throw new Error(
          `Не вдалося завантажити дані: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();

      // Заповнюємо дані
      guild.value = data.guild;
      channels.value = data.channels || [];
      roles.value = data.roles || [];
      webhooks.value = data.webhooks || [];

      // Основні налаштування
      mainSettings.value = {
        language: data.settings.language || 'uk',
        antiRaid: data.settings.antiCrashMode || false,
        autoMod: data.settings.blocking_enabled || false,
      };

      // Whitelist ролі
      whitelistRoles.value = data.settings.whitelist || [];

      // Налаштування верифікації
      if (data.verification) {
        verificationSettings.value = {
          verifiedRole: data.verification.verifiedRole,
          unverifiedRole: data.verification.unverifiedRole,
          verificationChannel: data.verification.verificationChannel,
          captchaEnabled: data.verification.captchaEnabled || false,
        };
      }

      // Налаштування логування
      if (data.logging) {
        loggingSettings.value = {
          webhookId: data.logging.webhookId,
          messageDelete:
            data.logging.messageDelete !== undefined
              ? data.logging.messageDelete
              : true,
        };
      }

      whitelistRoles.value = data.settings.whitelist || [];
    } catch (err) {
      console.error('Помилка завантаження:', err);
      if (onError) onError(err.message);
    } finally {
      isLoading.value = false;
    }
  }

  async function saveMainSettings(onSuccess, onError) {
    try {
      const res = await apiFetch(`/api/guild/${guildId}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: mainSettings.value.language,
          antiCrashMode: mainSettings.value.antiRaid,
          blocking_enabled: mainSettings.value.autoMod,
          whitelist: whitelistRoles.value,
        }),
      });

      if (!res.ok) throw new Error('Помилка збереження');

      if (onSuccess) onSuccess('Налаштування збережено!');

      // Перезавантажуємо всі дані
      await loadGuildData(onError);
    } catch (err) {
      console.error('Помилка збереження:', err);
      if (onError) onError(err.message);
    }
  }

  async function saveVerificationSettings(onSuccess, onError) {
    try {
      const res = await apiFetch(`/api/guild/${guildId}/verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verifiedRole: verificationSettings.value.verifiedRole,
          unverifiedRole: verificationSettings.value.unverifiedRole,
          verificationChannel: verificationSettings.value.verificationChannel,
          captchaEnabled: verificationSettings.value.captchaEnabled,
        }),
      });

      if (!res.ok) throw new Error('Помилка збереження верифікації');

      if (onSuccess) onSuccess('Налаштування верифікації збережено!');

      // Перезавантажуємо всі дані
      await loadGuildData(onError);
    } catch (err) {
      console.error('Помилка збереження верифікації:', err);
      if (onError) onError(err.message);
    }
  }

  async function saveLoggingSettings(onSuccess, onError) {
    try {
      // Знаходимо URL вебхука
      let webhookUrl = null;
      if (loggingSettings.value.webhookId) {
        const webhook = webhooks.value.find(
          (w) => w.id === loggingSettings.value.webhookId
        );
        if (webhook) {
          webhookUrl = `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}`;
        }
      }

      const res = await apiFetch(`/api/guild/${guildId}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logchannel: webhookUrl,
        }),
      });

      if (!res.ok) throw new Error('Помилка збереження логування');

      if (onSuccess) onSuccess('Налаштування логування збережено!');

      // Перезавантажуємо всі дані
      await loadGuildData(onError);
    } catch (err) {
      console.error('Помилка збереження логування:', err);
      if (onError) onError(err.message);
    }
  }

  return {
    guild,
    channels,
    roles,
    webhooks,
    isLoading,
    mainSettings,
    loggingSettings,
    verificationSettings,
    whitelistRoles,
    availableRoles,
    textChannels,
    loadGuildData,
    saveMainSettings,
    saveVerificationSettings,
    saveLoggingSettings,
  };
}
