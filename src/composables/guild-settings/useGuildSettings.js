import { ref, computed } from 'vue';
import { apiFetch } from '@/api';

export function useGuildSettings(guildId) {
  // Стан даних сервера
  const guild = ref(null);
  const channels = ref([]);
  const roles = ref([]);
  const webhooks = ref([]);
  const isLoading = ref(true);

  // Стан налаштувань
  const mainSettings = ref({ language: 'en', antiRaid: false, autoMod: false });
  const loggingSettings = ref({ webhookId: null, messageDelete: true });
  const verificationSettings = ref({
    verifiedRole: null,
    unverifiedRole: null,
    verificationChannel: null,
    captchaEnabled: false,
  });
  const whitelistRoles = ref([]);

  // Обчислювані властивості (Фільтри)
  const availableRoles = computed(() =>
    roles.value.filter((r) => !r.managed && r.name !== '@everyone')
  );
  const textChannels = computed(() =>
    channels.value.filter((c) => c.type === 0)
  );
  const isVerificationSetupComplete = computed(
    () =>
      verificationSettings.value.verifiedRole &&
      verificationSettings.value.unverifiedRole &&
      verificationSettings.value.verificationChannel
  );

  async function loadGuildData(onError) {
    isLoading.value = true;
    try {
      // Тут твій великий Promise.all з оригінального коду
      const [guildRes, fullSettingsRes, channelsRes, rolesRes] =
        await Promise.all([
          apiFetch(`/api/guild/${guildId}`),
          apiFetch(`/api/guild/${guildId}/full-settings`),
          apiFetch(`/api/guild/${guildId}/channels`),
          apiFetch(`/api/guild/${guildId}/roles`),
        ]);

      if (!guildRes.ok) throw new Error('Не вдалося завантажити дані');

      guild.value = await guildRes.json();
      const fullSettings = fullSettingsRes.ok
        ? await fullSettingsRes.json()
        : {};

      if (channelsRes.ok) channels.value = await channelsRes.json();
      if (rolesRes.ok) roles.value = await rolesRes.json();

      // Розподіляємо налаштування з бекенду по наших змінних
      mainSettings.value.language = fullSettings.language || 'en';
      mainSettings.value.antiRaid = fullSettings.antiCrashMode || false;

      if (fullSettings.verificationSystem) {
        verificationSettings.value.verifiedRole =
          fullSettings.verificationSystem.verifiedRoleId;
        // ... заповнюємо інші налаштування верифікації
      }
    } catch (err) {
      onError(err.message);
    } finally {
      isLoading.value = false;
    }
  }

  async function saveMainSettings(onSuccess, onError) {
    try {
      const res = await apiFetch(`/api/guild/${guildId}/settings`, {
        method: 'POST',
        body: JSON.stringify({
          language: mainSettings.value.language,
          antiCrashMode: mainSettings.value.antiRaid,
          whitelist: whitelistRoles.value,
        }),
      });
      if (!res.ok) throw new Error('Помилка збереження');
      onSuccess('Збережено!');
    } catch (err) {
      onError(err.message);
    }
  }

  // Такі ж функції для saveVerificationSettings та saveLoggingSettings

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
    isVerificationSetupComplete,
    loadGuildData,
    saveMainSettings,
  };
}
