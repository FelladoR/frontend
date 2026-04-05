<template>
  <meta charset="UTF-8" />
  <title>Налаштування серверу</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
  />
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
  />

  <header-component />

  <div v-if="isLoading" class="loading-container">
    <div class="spinner" />
    <p>Завантаження налаштувань...</p>
  </div>

  <div v-else>
    <div class="main-content">
      <div class="page-container">
        <div class="guild-header-container">
          <div class="d-flex align-items-center">
            <div v-if="guild && guild.icon" class="guild-icon me-3">
              <img
                :src="
                  'https://cdn.discordapp.com/icons/' +
                  guild.id +
                  '/' +
                  guild.icon +
                  '.png'
                "
                alt="Guild Icon"
              />
            </div>
            <div v-if="guild">
              <h2>{{ guild.name }}</h2>
              <small class="text-muted">ID: {{ guildId }}</small>
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="progress-container">
          <div class="progress-bar" :style="{ width: loadingProgress + '%' }" />
        </div>

        <div v-if="isLoading && loadingProgress < 100" class="text-center py-3">
          <div class="d-flex justify-content-center align-items-center">
            <div class="loading-spinner" />
            <p>Завантаження... {{ Math.round(loadingProgress) }}%</p>
          </div>
        </div>

        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
          <button
            class="btn btn-sm btn-outline-secondary ms-2"
            @click="loadGuildData"
          >
            Спробувати знову
          </button>
        </div>

        <div v-else class="guild-settings">
          <div class="settings-tabs">
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'main' }"
              @click="activeTab = 'main'"
            >
              {{ t('guild.head_buttons.main_settings') }}
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'logging' }"
              @click="activeTab = 'logging'"
            >
              {{ t('guild.head_buttons.logging') }}
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'verification' }"
              @click="activeTab = 'verification'"
            >
              {{ t('guild.head_buttons.verification') }}
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'backups' }"
              @click="activeTab = 'backups'"
            >
              {{ t('guild.head_buttons.backups') }}
            </button>
          </div>

          <!-- Основні налаштування -->
          <div class="tab-content" :class="{ active: activeTab === 'main' }">
            <div class="settings-card">
              <h4 class="mb-4">
                <i class="fa-solid fa-gear" />{{
                  t('guild.main_settings.title')
                }}
              </h4>

              <div class="mb-3">
                <label
                  class="form-label d-flex align-items-center justify-content-between"
                >
                  <span>{{ t('guild.main_settings.language') }}</span>
                  <select
                    v-model="mainSettings.language"
                    class="form-select w-auto"
                  >
                    <option value="uk">Українська</option>
                    <option value="en">English</option>
                  </select>
                </label>
              </div>

              <div class="mb-3">
                <label
                  class="form-label d-flex align-items-center justify-content-between"
                >
                  <span>{{ t('guild.main_settings.people_ban') }}</span>
                  <label class="toggle-switch">
                    <input v-model="mainSettings.autoMod" type="checkbox" />
                    <span class="slider" />
                  </label>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-label mb-2">{{
                  t('guild.main_settings.whitelist')
                }}</label>
                <div class="whitelist-roles">
                  <div class="d-flex mb-2 gap-2">
                    <input
                      v-model="roleQuery"
                      type="search"
                      class="form-control form-control-sm"
                      :placeholder="t('guild.main_settings.search_placeholder')"
                      aria-label="Пошук ролі"
                    />
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                      title="Очистити пошук"
                      @click="roleQuery = ''"
                    >
                      ✕
                    </button>
                  </div>

                  <div v-if="rolesLoading" class="text-center py-2">
                    <div class="loading-spinner" />
                    <div class="small mt-1">Завантаження ролей...</div>
                  </div>

                  <div
                    v-else-if="filteredRoles.length === 0"
                    class="text-muted text-center py-2"
                  >
                    {{ t('guild.main_settings.no_roles') }}
                  </div>

                  <div v-else class="roles-list">
                    <label
                      v-for="role in filteredRoles"
                      :key="role.id"
                      class="role-item"
                    >
                      <input
                        :id="'role-' + role.id"
                        v-model="whitelistRoles"
                        type="checkbox"
                        :value="role.id"
                        class="form-check-input me-2"
                      />

                      <span
                        class="role-swatch"
                        :style="{
                          backgroundColor: role.color
                            ? '#' + role.color.toString(16).padStart(6, '0')
                            : '#888888',
                        }"
                      />

                      <span class="role-name">{{ role.name }}</span>

                      <small v-if="role.members > 0" class="text-muted ms-auto">
                        ({{ role.members }})
                      </small>
                    </label>
                  </div>
                </div>
              </div>

              <button
                class="btn btn-primary"
                :disabled="isSaving"
                @click="handleSaveSettings"
              >
                <span v-if="isSaving" class="d-flex align-items-center">
                  <span class="loading-spinner" />
                  <span>{{ t('guild.main_settings.saving') }}</span>
                </span>
                <span v-else>{{ t('guild.main_settings.save_settings') }}</span>
              </button>

              <div v-if="successMessage" class="alert alert-success mt-3">
                {{ successMessage }}
              </div>
            </div>
          </div>

          <div class="tab-content" :class="{ active: activeTab === 'logging' }">
            <div class="settings-card">
              <h4 class="mb-4">
                <i class="fa-solid fa-layer-group" />{{
                  t('guild.logging.title')
                }}
              </h4>

              <div class="mb-3">
                <label class="form-label">{{
                  t('guild.logging.current_webhook')
                }}</label>
                <div v-if="currentWebhook" class="mb-2 p-3 bg-dark rounded">
                  <div>
                    <strong>{{ t('guild.logging.webhook_data.name') }}</strong>
                    {{ currentWebhook.name || 'Без назви' }}
                  </div>
                  <div>
                    <strong>{{
                      t('guild.logging.webhook_data.channel')
                    }}</strong>
                    {{ getChannelName(currentWebhook.channel_id) }}
                  </div>
                  <div><strong>ID:</strong> {{ currentWebhook.id }}</div>
                </div>
                <div v-else class="text-muted mb-2">
                  {{ t('guild.logging.not_setup') }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">{{
                  t('guild.logging.choose_webhook')
                }}</label>
                <select
                  v-model="loggingSettings.webhookId"
                  class="form-select"
                  :disabled="isSaving"
                >
                  <option value="">
                    -- {{ t('guild.logging.choose_webhook') }} --
                  </option>
                  <option
                    v-for="webhook in webhooks"
                    :key="webhook.id"
                    :value="webhook.id"
                  >
                    {{ webhook.name || 'Без назви' }} (Канал:
                    {{ getChannelName(webhook.channel_id) }})
                  </option>
                </select>
              </div>

              <div v-if="loggingSettings.webhookId" class="mb-3">
                <label class="form-label">{{
                  t('guild.logging.webhook_data.url')
                }}</label>
                <div class="input-group">
                  <input
                    :type="showWebhookUrl ? 'text' : 'password'"
                    class="form-control"
                    :value="getWebhookUrl(loggingSettings.webhookId)"
                    readonly
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    title="Копіювати"
                    @click="copyWebhookUrl(loggingSettings.webhookId)"
                  >
                    <i class="fas fa-copy" />
                  </button>
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    :title="showWebhookUrl ? 'Приховати' : 'Показати'"
                    @click="showWebhookUrl = !showWebhookUrl"
                  >
                    <i
                      :class="
                        showWebhookUrl ? 'fas fa-eye-slash' : 'fas fa-eye'
                      "
                    />
                  </button>
                </div>
              </div>

              <button
                class="btn btn-primary"
                :disabled="isSaving"
                @click="saveLoggingSettings"
              >
                <span v-if="isSaving" class="d-flex align-items-center">
                  <span class="loading-spinner" />
                  <span>{{ t('guild.main_settings.saving') }}</span>
                </span>
                <span v-else>{{ t('guild.main_settings.save_settings') }}</span>
              </button>

              <div v-if="successMessage" class="alert alert-success mt-3">
                {{ successMessage }}
              </div>
            </div>
          </div>

          <div
            class="tab-content"
            :class="{ active: activeTab === 'verification' }"
          >
            <div class="settings-card">
              <h4 class="mb-4">
                <i class="fas fa-user-check me-2" />{{
                  t('guild.verification.title')
                }}
              </h4>

              <!-- Форма налаштувань -->
              <div class="settings-form">
                <div class="mb-3">
                  <label class="form-label">{{
                    t('guild.verification.verifed_members')
                  }}</label>
                  <select
                    v-model="verificationSettings.verifiedRole"
                    class="form-select"
                  >
                    <option value="">
                      {{ t('guild.verification.choose_role') }}
                    </option>
                    <option
                      v-for="role in availableRoles"
                      :key="'verified-' + role.id"
                      :value="role.id"
                      :selected="role.id === verificationSettings.verifiedRole"
                    >
                      {{ role.name }}
                    </option>
                  </select>
                  <div v-if="verificationSettings.verifiedRole" class="mt-2">
                    <span
                      class="badge"
                      :style="{
                        backgroundColor:
                          '#' + getRoleColor(verificationSettings.verifiedRole),
                      }"
                    >
                      {{ getRoleName(verificationSettings.verifiedRole) }}
                    </span>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">{{
                    t('guild.verification.new_members')
                  }}</label>
                  <select
                    v-model="verificationSettings.unverifiedRole"
                    class="form-select"
                  >
                    <option value="">
                      {{ t('guild.verification.choose_role') }}
                    </option>
                    <option
                      v-for="role in availableRoles"
                      :key="'unverified-' + role.id"
                      :value="role.id"
                      :selected="
                        role.id === verificationSettings.unverifiedRole
                      "
                    >
                      {{ role.name }}
                    </option>
                  </select>
                  <div v-if="verificationSettings.unverifiedRole" class="mt-2">
                    <span
                      class="badge"
                      :style="{
                        backgroundColor:
                          '#' +
                          getRoleColor(verificationSettings.unverifiedRole),
                      }"
                    >
                      {{ getRoleName(verificationSettings.unverifiedRole) }}
                    </span>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">{{
                    t('guild.verification.channel')
                  }}</label>
                  <select
                    v-model="verificationSettings.verificationChannel"
                    class="form-select"
                  >
                    <option value="">
                      {{ t('guild.verification.choose_channel') }}
                    </option>
                    <option
                      v-for="channel in textChannels"
                      :key="'channel-' + channel.id"
                      :value="channel.id"
                      :selected="
                        channel.id === verificationSettings.verificationChannel
                      "
                    >
                      #{{ channel.name }}
                    </option>
                  </select>
                  <div
                    v-if="verificationSettings.verificationChannel"
                    class="mt-2"
                  >
                    <span class="badge bg-secondary">
                      {{
                        getChannelName(verificationSettings.verificationChannel)
                      }}
                    </span>
                  </div>
                </div>

                <div class="mb-4">
                  <label
                    class="form-label d-flex align-items-center justify-content-between"
                  >
                    <span>{{ t('guild.verification.enable_captcha') }}</span>
                    <label class="toggle-switch">
                      <input
                        v-model="verificationSettings.captchaEnabled"
                        type="checkbox"
                        :checked="verificationSettings.captchaEnabled"
                      />
                      <span class="slider" />
                    </label>
                  </label>
                </div>

                <button
                  class="btn btn-primary"
                  :disabled="isSaving"
                  @click="saveVerificationSettings"
                >
                  <span v-if="isSaving" class="d-flex align-items-center">
                    <span class="loading-spinner me-2" />
                    <span>{{ t('guild.main_settings.saving') }}</span>
                  </span>
                  <span v-else>
                    <i class="fas fa-save me-1" />
                    {{ t('guild.main_settings.save_settings') }}
                  </span>
                </button>

                <div v-if="successMessage" class="alert alert-success mt-3">
                  {{ successMessage }}
                </div>
              </div>
            </div>
          </div>

          <div class="tab-content" :class="{ active: activeTab === 'backups' }">
            <div class="settings-card">
              <h4 class="mb-4">
                <i class="fa-solid fa-gear" />
                {{ t('guild.backups.title') }}
              </h4>

              <div v-if="!hasAdminPermissions" class="alert alert-danger mb-4">
                <i class="fas fa-exclamation-triangle me-2" />
                <span v-html="t('guild.backups.no_perms')" />
              </div>
              <!-- 
                            <fieldset :disabled="!hasAdminPermissions">
                                <div class="mb-4">
                                    <label class="form-label"> -->
              <!-- Текст і кнопка в ряд -->
              <!-- <div class="d-flex align-items-center justify-content-between mb-2">
                                        <span>Автоматичні резервні копіювання:</span>
                                        <select 
                                            v-model="mainSettings.backupInterval"
                                            class="form-select w-auto"
                                            :disabled="!mainSettings.isPremium"
                                        >
                                            <option value="off">Вимкнено</option>
                                            <option value="1h">1 година</option>
                                            <option value="6h">6 годин</option>
                                            <option value="12h">12 годин</option>
                                            <option value="1d">1 день</option>
                                            <option value="7d">7 днів</option>
                                        </select>
                                        </div>

                                      Повідомлення під ними -->
              <!-- <div v-if="!mainSettings.isPremium" class="alert alert-warning d-flex align-items-center">
                                        <i class="fas fa-info-circle me-2"></i>
                                        Ця функція доступна лише для преміум-гільдій
                                        </div>
                                    </label>
                                    </div>

                            </fieldset> -->

              <!-- Секція для відображення бекапів -->
              <div class="backups-section mt-4">
                <h5 class="mb-3">
                  <i class="fas fa-database" />
                  {{ t('guild.backups.backups_list') }}
                </h5>

                <div v-if="backups.loading" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">{{
                      t('guild.backups.loading')
                    }}</span>
                  </div>
                </div>

                <div
                  v-if="!backups.loading && !backups.list.length"
                  class="alert alert-info"
                >
                  <i class="fas fa-info-circle" />
                  {{ t('guild.backups.no_backups') }}
                </div>

                <div v-else-if="backups.list.length" class="table-responsive">
                  <table class="table table-hover backups-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>{{ t('guild.backups.date') }}</th>
                        <th>{{ t('guild.backups.actions') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="backup in backups.list"
                        :key="backup.backupId || backup._id"
                      >
                        <td>{{ backup.backupId || backup._id }}</td>
                        <td>{{ formatDate(backup.createdAt) }}</td>
                        <td>
                          <button
                            class="btn btn-sm btn-success me-2"
                            :disabled="
                              !hasAdminPermissions ||
                              restoringId === (backup.backupId || backup._id) ||
                              cooldown.isCooldown.value
                            "
                            @click="
                              confirmRestoreBackup(
                                backup.backupId || backup._id
                              )
                            "
                          >
                            <template
                              v-if="
                                restoringId === (backup.backupId || backup._id)
                              "
                            >
                              <i class="fas fa-spinner fa-spin" />
                              {{ t('guild.backups.recovery') }}
                            </template>
                            <template v-else-if="cooldown.isCooldown.value">
                              <i class="fas fa-clock" />
                              {{ t('guild.backups.wait') }}
                              {{ cooldown.cooldownRemaining.value }}с
                            </template>
                            <template v-else>
                              <i class="fas fa-undo" />
                              {{ t('guild.backups.restore') }}
                            </template>
                          </button>

                          <button
                            class="btn btn-sm btn-danger"
                            :disabled="!hasAdminPermissions"
                            @click="
                              confirmDeleteBackup(backup.backupId || backup._id)
                            "
                          >
                            <i class="fas fa-trash" />
                            {{ t('guild.backups.delete') }}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div
                  class="d-flex justify-content-between align-items-center mt-3"
                >
                  <button
                    class="btn btn-primary"
                    :disabled="
                      backups.creating ||
                      !hasAdminPermissions ||
                      cooldown.isCooldown.value
                    "
                    @click="handleCreateBackup"
                  >
                    <span
                      v-if="backups.creating"
                      class="d-flex align-items-center"
                    >
                      <span class="spinner-border spinner-border-sm me-2" />
                      {{ t('guild.backups.creating') }}
                    </span>
                    <span
                      v-else-if="cooldown.isCooldown.value"
                      class="d-flex align-items-center"
                    >
                      <i class="fas fa-clock me-2" />
                      {{ t('guild.backups.wait') }}
                      {{ cooldown.cooldownRemaining.value }}с
                    </span>
                    <span v-else>
                      <i class="fas fa-plus-circle me-2" />
                      {{ t('guild.backups.create') }}
                    </span>
                  </button>

                  <div class="text-muted small">
                    {{ t('guild.backups.all_backups') }}
                    {{ backups.list.length }}
                  </div>
                </div>
              </div>

              <div v-if="successMessage" class="alert alert-success mt-3">
                {{ successMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <footer-component />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import HeaderComponent from '@/components/layout/Header.vue';
import FooterComponent from '@/components/layout/Footer.vue';
import { apiFetch } from '@/api'; // Для додаткових запитів

import { useCooldown } from '@/composables/guild-settings/useCooldown.js';
import { useBackups } from '@/composables/guild-settings/useBackups.js';
import { useGuildSettings } from '@/composables/guild-settings/useGuildSettings.js';

const { t } = useI18n();
const route = useRoute();
const guildId = route.params.id; // Беремо ID з URL правильним шляхом

// ==========================================
// 1. UI ЗМІННІ (Вкладки, завантаження, помилки)
// ==========================================
const activeTab = ref('main');
const isSaving = ref(false);
const roleQuery = ref('');
const showWebhookUrl = ref(false);
const error = ref(null);
const successMessage = ref(null);
const loadingProgress = ref(100);
const rolesLoading = ref(false);
const restoringId = ref(null);
const cooldownId = ref(null);

const showError = (msg) => {
  error.value = msg;
  setTimeout(() => (error.value = null), 5000);
};
const showSuccess = (msg) => {
  successMessage.value = msg;
  setTimeout(() => (successMessage.value = null), 3000);
};

// ==========================================
// 2. ПІДКЛЮЧЕННЯ COMPOSABLES
// ==========================================
const cooldown = useCooldown(30);

const { backups, hasAdminPermissions, loadBackups, createBackup } = useBackups(
  guildId,
  {
    isCooldown: cooldown.isCooldown,
    cooldownMessage: cooldown.cooldownMessage,
    startCooldown: () => cooldown.startCooldown(30),
  }
);

// Витягуємо АБСОЛЮТНО ВСЕ, що потрібно шаблону
const {
  guild,
  isLoading,
  mainSettings,
  loggingSettings,
  verificationSettings,
  whitelistRoles,
  channels,
  roles,
  webhooks,
  textChannels,
  availableRoles,
  loadGuildData,
  saveMainSettings,
  saveVerificationSettings, // Додати
  saveLoggingSettings, // Додати
} = useGuildSettings(guildId);

// ==========================================
// 3. ОБЧИСЛЮВАНІ ВЛАСТИВОСТІ (Фільтри)
// ==========================================
const filteredRoles = computed(() => {
  if (!availableRoles.value) return [];
  const q = roleQuery.value.trim().toLowerCase();
  if (!q) return availableRoles.value;
  return availableRoles.value.filter((r) =>
    (r.name || '').toLowerCase().includes(q)
  );
});

const currentWebhook = computed(() => {
  if (!loggingSettings.value?.webhookId || !webhooks.value) return null;
  return webhooks.value.find((w) => w.id === loggingSettings.value.webhookId);
});

// ==========================================
// 4. ДОПОМІЖНІ ФУНКЦІЇ (Форматування, UI)
// ==========================================
function getChannelName(channelId) {
  const channel = channels.value?.find((c) => c.id === channelId);
  return channel ? `#${channel.name}` : channelId;
}

function getRoleName(roleId) {
  const role = roles.value?.find((r) => r.id === roleId);
  return role ? role.name : null;
}

function getRoleColor(roleId) {
  const role = roles.value?.find((r) => r.id === roleId);
  return role ? role.color.toString(16).padStart(6, '0') : 'ffffff';
}

function getWebhookUrl(webhookId) {
  const webhook = webhooks.value?.find((w) => w.id === webhookId);
  return webhook
    ? `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}`
    : '';
}

function copyWebhookUrl(webhookId) {
  const url = getWebhookUrl(webhookId);
  navigator.clipboard
    .writeText(url)
    .then(() => showSuccess('URL вебхука скопійовано!'))
    .catch(() => showError('Не вдалося скопіювати URL'));
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

// ==========================================
// 5. ДІЇ ЗБЕРЕЖЕННЯ ТА КНОПОК
// ==========================================
async function handleSaveSettings() {
  isSaving.value = true;
  // Викликаємо функцію з composable
  await saveMainSettings(showSuccess, showError);
  isSaving.value = false;
}

async function handleCreateBackup() {
  if (confirm('Створити нову резервну копію?')) {
    await createBackup(showSuccess, showError);
  }
}
async function confirmRestoreBackup(id) {
  if (!confirm('Ви впевнені, що хочете відновити цей бекап?')) return;

  // Перевірка кулдауну - ВАЖЛИВО: використовуємо .value
  if (cooldown.isCooldown.value) {
    showError(
      `Зачекайте ${cooldown.cooldownRemaining.value} секунд перед наступним відновленням`
    );
    return;
  }

  restoringId.value = id;
  try {
    const userResponse = await apiFetch('/api/auth/user');
    const userData = await userResponse.json();

    const response = await apiFetch(
      `/api/guild/${guildId}/backups/${id}/restore`,
      {
        method: 'POST',
        body: JSON.stringify({
          guildId: guildId,
          backupId: id,
          user: userData.id,
        }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Помилка відновлення');
    }
    showSuccess('Бекап успішно відновлено!');
    cooldown.startCooldown(30);
  } catch (err) {
    showError(err.message);
  } finally {
    restoringId.value = null;
  }
}
async function checkInitialCooldown() {
  try {
    const response = await apiFetch('/api/guild/cooldown');
    if (response.ok) {
      const data = await response.json();
      console.log('Перевірка кулдауну:', data);
      // Перевіряємо, що remaining > 0 і hasCooldown === true
      if (data.hasCooldown && data.remaining > 0) {
        cooldown.setRemainingTime(data.remaining);
      } else {
        // Якщо кулдаун минув, скидаємо стан
        cooldown.resetCooldown();
      }
    }
  } catch (error) {
    console.error('Помилка перевірки кулдауну:', error);
  }
}

async function confirmDeleteBackup(id) {
  if (confirm('Ви впевнені, що хочете видалити цей бекап?')) {
    try {
      const response = await apiFetch(`/api/backups/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Помилка видалення');
      backups.value.list = backups.value.list.filter(
        (b) => b.id !== id && b.backupId !== id
      );
      showSuccess('Бекап видалено!');
    } catch (err) {
      showError(err.message);
    }
  }
}

onMounted(async () => {
  await loadGuildData(showError);
  await loadBackups();
  await checkInitialCooldown();
  // Перевірка реальних значень
  console.log('=== ДІАГНОСТИКА КУЛДАУНУ ===');
  console.log('cooldown.isCooldown:', cooldown.isCooldown);
  console.log('cooldown.isCooldown.value:', cooldown.isCooldown.value);
  console.log('cooldown.cooldownRemaining:', cooldown.cooldownRemaining);
  console.log(
    'cooldown.cooldownRemaining.value:',
    cooldown.cooldownRemaining.value
  );
});
</script>
<style scoped>
@import '../styles/guild.css';
</style>
