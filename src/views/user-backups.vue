<template>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Antilink – Backups</title>

  <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
  />

  <header-component />

  <main class="main-content">
    <div class="backups-page">
      <div class="page-header">
        <h1>{{ t('backups.page_title') }}</h1>
        <p class="subtitle">
          {{ t('backups.page_description') }}
        </p>
      </div>

      <!-- Стан завантаження -->
      <div v-if="loading" class="empty-state">
        <div class="loading-spinner" style="width: 40px; height: 40px" />
        <h3>{{ t('backups.loading') }}</h3>
      </div>

      <!-- Список бекапів -->
      <div v-else-if="backups.length > 0" class="backups-list">
        <div v-for="backup in backups" :key="backup.id" class="backup-card">
          <div class="backup-header">
            <div class="backup-title">
              <div class="backup-title-content">
                <h3 class="backup-name">
                  {{ backup.name }}
                </h3>
                <div class="backup-guild-info">
                  <span class="status-badge status-completed">
                    {{ t('backups.status_completed') }}
                  </span>
                  <span class="guild-name">
                    {{ backup.id }}
                  </span>
                </div>
              </div>
            </div>
            <div class="backup-meta">
              <div class="meta-item">
                <span class="meta-label">{{ t('backups.created') }}</span>
                <span class="meta-value">{{
                  formatDate(backup.createdAt)
                }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">{{ t('backups.type') }}</span>
                <span class="meta-value">{{ backup.type || '0 MB' }}</span>
              </div>
            </div>
          </div>
          <!-- Замініть блок backup-details на цей код -->
          <div class="backup-details">
            <div
              v-if="expandedBackup === backup.id"
              style="
                background: rgba(255, 0, 0, 0.1);
                padding: 1rem;
                margin: 1rem 0;
                border-radius: 8px;
              "
            >
              <h4>{{ t('backups.debug_title', { id: backup.id }) }}</h4>
              <p>
                {{ t('backups.debug_details_loaded') }} {{ !!backup.details }}
              </p>
              <p>
                {{ t('backups.debug_roles_count') }}
                {{ getRoles(backup).length }}
              </p>
              <div v-if="getRoles(backup).length > 0">
                <p>{{ t('backups.debug_first_roles') }}</p>
                <div
                  v-for="(role, index) in getRoles(backup).slice(0, 3)"
                  :key="role.id"
                >
                  {{ role.name }} - {{ t('backups.debug_color') }}:
                  {{ role.color }} - HEX:
                  {{ getRoleColor(role.color) }}
                </div>
              </div>
            </div>
            <div class="backup-stats">
              <div
                v-if="expandedBackup === backup.id"
                style="
                  background: rgba(255, 0, 0, 0.1);
                  padding: 1rem;
                  margin: 1rem 0;
                  border-radius: 8px;
                "
              />
              <div class="stat">
                <span class="stat-value">{{ countCategories(backup) }}</span>
                <span class="stat-label">{{
                  t('backups.stats_categories')
                }}</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ countChannels(backup) }}</span>
                <span class="stat-label">{{
                  t('backups.stats_channels')
                }}</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ getRoles(backup).length }}</span>
                <span class="stat-label">{{ t('backups.stats_roles') }}</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ getEmojis(backup).length }}</span>
                <span class="stat-label">{{ t('backups.stats_emojis') }}</span>
              </div>
            </div>

            <div class="backup-actions-row">
              <button
                class="btn primary-btn"
                @click="restoreBackup(backup.id, backup.guildId)"
              >
                <i class="fas fa-redo" /> {{ t('backups.action_restore') }}
              </button>

              <button
                class="btn secondary-btn"
                @click="openBackupModal(backup.id)"
              >
                <i class="fas fa-eye" /> {{ t('backups.action_details') }}
              </button>

              <button
                class="btn secondary-btn"
                @click="deleteBackup(backup.id)"
              >
                <i class="fas fa-trash" /> {{ t('backups.action_delete') }}
              </button>
            </div>

            <!-- Детальна інформація -->
            <div v-if="expandedBackup === backup.id" class="backup-expanded">
              <!-- Ролі -->
              <div class="detail-section">
                <div
                  class="section-header"
                  @click="toggleSection(backup.id, 'roles')"
                >
                  <h4>
                    <i class="fas fa-user-tag" />
                    {{ t('backups.section_roles') }}
                    <span class="count">{{
                      backup.details?.roles?.length || 0
                    }}</span>
                  </h4>
                  <i
                    class="fas fa-chevron-down chevron"
                    :class="{
                      rotated: isSectionExpanded(backup.id, 'roles'),
                    }"
                  />
                </div>
                <div
                  class="section-content"
                  :class="{ expanded: isSectionExpanded(backup.id, 'roles') }"
                >
                  <div v-if="backup.details?.roles?.length" class="item-list">
                    <div
                      v-for="role in backup.details.roles"
                      :key="role.id"
                      class="role-item"
                    >
                      <div
                        class="role-color-indicator"
                        :style="{
                          backgroundColor: role.color
                            ? `#${role.color.toString(16).padStart(6, '0')}`
                            : '#99aab5',
                          borderColor: role.color
                            ? `#${role.color.toString(16).padStart(6, '0')}`
                            : '#99aab5',
                        }"
                      />
                      <div class="role-info">
                        <div class="role-name">
                          {{ role.name }}
                        </div>
                        <div class="role-meta">
                          <span
                            >{{ t('backups.role_position') }}
                            {{ role.position }}</span
                          >
                          <span
                            >• {{ t('backups.role_permissions') }}:
                            {{ role.permissions || 0 }}</span
                          >
                          <span
                            v-if="role.hoist"
                            class="role-badge badge-hoist"
                            >{{ t('backups.role_hoist') }}</span
                          >
                          <span
                            v-if="role.mentionable"
                            class="role-badge badge-mentionable"
                            >{{ t('backups.role_mentionable') }}</span
                          >
                          <span
                            v-if="role.permissions & 0x8"
                            class="role-badge badge-admin"
                            >{{ t('backups.role_admin') }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="empty-list">
                    {{ t('backups.no_roles') }}
                  </div>
                </div>
              </div>

              <!-- Канали -->
              <div class="detail-section">
                <div
                  class="section-header"
                  @click="toggleSection(backup.id, 'channels')"
                >
                  <h4>
                    <i class="fas fa-hashtag" />
                    {{ t('backups.section_channels') }}
                    <span class="count">{{
                      backup.details?.channels?.length || 0
                    }}</span>
                  </h4>
                  <i
                    class="fas fa-chevron-down chevron"
                    :class="{
                      rotated: isSectionExpanded(backup.id, 'channels'),
                    }"
                  />
                </div>
                <div
                  class="section-content"
                  :class="{
                    expanded: isSectionExpanded(backup.id, 'channels'),
                  }"
                >
                  <div
                    v-if="backup.details?.channels?.length"
                    class="item-list"
                  >
                    <div
                      v-for="channel in backup.details.channels"
                      :key="channel.id"
                      class="item-row"
                    >
                      <div class="item-icon">
                        <i :class="getChannelIcon(channel)" />
                      </div>
                      <div class="item-info">
                        <div class="item-name">
                          {{ channel.name }}
                        </div>
                        <div class="item-meta">
                          <span
                            class="channel-type"
                            :class="'channel-' + getChannelTypeText(channel)"
                          >
                            {{ getChannelTypeText(channel) }}
                          </span>
                          <span v-if="channel.topic"
                            >• {{ channel.topic }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="empty-list">
                    {{ t('backups.no_channels') }}
                  </div>
                </div>
              </div>

              <!-- Емодзі -->
              <div class="detail-section">
                <div
                  class="section-header"
                  @click="toggleSection(backup.id, 'emojis')"
                >
                  <h4>
                    <i class="fas fa-smile" />
                    {{ t('backups.section_emojis') }}
                    <span class="count">{{
                      backup.details?.emojis?.length || 0
                    }}</span>
                  </h4>
                  <i
                    class="fas fa-chevron-down chevron"
                    :class="{
                      rotated: isSectionExpanded(backup.id, 'emojis'),
                    }"
                  />
                </div>
                <div
                  class="section-content"
                  :class="{
                    expanded: isSectionExpanded(backup.id, 'emojis'),
                  }"
                >
                  <div v-if="backup.details?.emojis?.length" class="item-list">
                    <div
                      v-for="emoji in backup.details.emojis"
                      :key="emoji.id"
                      class="item-row"
                    >
                      <img
                        v-if="emoji.url"
                        :src="emoji.url"
                        :alt="emoji.name"
                        class="emoji-image"
                      />
                      <div v-else class="item-icon">
                        <i class="fas fa-image" />
                      </div>
                      <div class="item-info">
                        <div class="item-name">:{{ emoji.name }}:</div>
                        <div v-if="emoji.animated" class="item-meta">
                          {{ t('backups.emoji_animated') }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="empty-list">
                    {{ t('backups.no_emojis') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Пустий стан -->
      <div v-else class="empty-state">
        <i class="fas fa-inbox" />
        <h3>{{ t('backups.empty_state_title') }}</h3>
        <p>
          {{ t('backups.empty_state_description') }}
        </p>
      </div>
    </div>
  </main>

  <div v-if="modalBackupId" class="backup-modal" @click.self="closeBackupModal">
    <div v-if="getCurrentBackup()" class="modal-content">
      <div class="modal-header">
        <div class="modal-header-content">
          <img
            v-if="getCurrentBackup().guildIcon"
            :src="getCurrentBackup().guildIcon"
            :alt="getCurrentBackup().guildName"
            class="modal-guild-icon"
          />
          <div
            v-else
            class="modal-guild-icon"
            style="
              background: var(--accent);
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <i class="fas fa-server" />
          </div>
          <div class="modal-title">
            <h3>{{ getCurrentBackup().name }}</h3>
            <div class="modal-subtitle">
              <span class="status-badge status-completed">{{
                t('backups.status_completed')
              }}</span>
              <span>{{ getCurrentBackup().id }}</span>
              <span>•</span>
              <span>{{ formatDate(getCurrentBackup().createdAt) }}</span>
            </div>
          </div>
        </div>
        <div class="close-modal" @click="closeBackupModal">
          <i class="fas fa-times" />
        </div>
      </div>

      <div class="modal-body">
        <div class="modal-stats">
          <div class="modal-stat">
            <div class="modal-stat-value">
              {{ countCategories(getCurrentBackup()) }}
            </div>
            <div class="modal-stat-label">
              {{ t('backups.stats_categories') }}
            </div>
          </div>
          <div class="modal-stat">
            <div class="modal-stat-value">
              {{ countChannels(getCurrentBackup()) }}
            </div>
            <div class="modal-stat-label">
              {{ t('backups.stats_channels') }}
            </div>
          </div>
          <div class="modal-stat">
            <div class="modal-stat-value">
              {{ getRoles(getCurrentBackup()).length }}
            </div>
            <div class="modal-stat-label">
              {{ t('backups.stats_roles') }}
            </div>
          </div>
          <div class="modal-stat">
            <div class="modal-stat-value">
              {{ getEmojis(getCurrentBackup()).length }}
            </div>
            <div class="modal-stat-label">
              {{ t('backups.stats_emojis') }}
            </div>
          </div>
        </div>

        <div class="modal-sections">
          <!-- Канали -->
          <div class="modal-section">
            <div
              class="modal-section-header"
              @click="expandedSections.channels = !expandedSections.channels"
            >
              <div class="modal-section-title">
                <i class="fas fa-hashtag" />
                {{ t('backups.section_channels') }}
                <span class="section-count">
                  {{ countChannels(getCurrentBackup()) }}
                  {{ t('backups.channels_count') }} /
                  {{ countCategories(getCurrentBackup()) }}
                  {{ t('backups.categories_count') }}
                </span>
              </div>
              <i
                class="fas fa-chevron-down"
                :class="{ rotated: expandedSections.channels }"
              />
            </div>
            <div
              class="modal-section-content"
              :class="{ expanded: expandedSections.channels }"
            >
              <div
                v-if="getChannels(getCurrentBackup()).length"
                class="modal-items"
              >
                <div
                  v-for="channel in getChannels(getCurrentBackup())"
                  :key="channel.id || channel.name"
                  class="modal-item"
                  :style="{
                    'margin-left': channel.parentCategory ? '1rem' : '0',
                    'border-left': channel.parentCategory
                      ? '2px solid var(--accent)'
                      : 'none',
                  }"
                >
                  <div class="modal-item-icon">
                    <i :class="getChannelIcon(channel)" />
                  </div>
                  <div class="modal-item-info">
                    <div class="modal-item-name">
                      {{ channel.name }}
                      <span
                        v-if="channel.isCategory"
                        style="color: var(--accent); font-size: 0.8em"
                      >
                        ({{ t('backups.channel_category') }})</span
                      >
                    </div>
                    <div class="modal-item-meta">
                      <span
                        class="channel-badge"
                        :class="getChannelBadgeClass(channel)"
                      >
                        {{ getChannelTypeName(channel) }}
                      </span>
                      <span
                        v-if="channel.parentCategory && !channel.isCategory"
                      >
                        • {{ channel.parentCategory }}
                      </span>
                      <span v-if="channel.topic && channel.topic.length > 0">
                        • {{ channel.topic }}
                      </span>
                      <span
                        v-if="channel.children && channel.children.length > 0"
                      >
                        • {{ channel.children.length }}
                        {{ t('backups.channels_count') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-section">
                {{ t('backups.no_channels') }}
              </div>
            </div>
          </div>

          <!-- Ролі -->
          <div class="modal-section">
            <div
              class="modal-section-header"
              @click="expandedSections.roles = !expandedSections.roles"
            >
              <div class="modal-section-title">
                <i class="fas fa-user-tag" />
                {{ t('backups.section_roles') }}
                <span class="section-count">
                  {{ getRoles(getCurrentBackup()).length }}
                </span>
              </div>
              <i
                class="fas fa-chevron-down"
                :class="{ rotated: expandedSections.roles }"
              />
            </div>
            <div
              class="modal-section-content"
              :class="{ expanded: expandedSections.roles }"
            >
              <div
                v-if="getRoles(getCurrentBackup()).length"
                class="modal-items"
              >
                <div
                  v-for="role in getRoles(getCurrentBackup())"
                  :key="role.id"
                  class="modal-item"
                >
                  <div class="modal-item-icon">
                    <div
                      class="role-color-preview"
                      :style="{
                        backgroundColor: role.color
                          ? `#${role.color.toString(16).padStart(6, '0')}`
                          : '#99aab5',
                      }"
                    />
                  </div>
                  <div class="modal-item-info">
                    <div class="modal-item-name">
                      {{ role.name }}
                    </div>
                    <div class="modal-item-meta">
                      {{ t('backups.role_position') }}: {{ role.position }}
                      <span v-if="role.permissions"
                        >• {{ t('backups.role_permissions') }}:
                        {{ role.permissions }}</span
                      >
                      <span v-if="role.mentionable"
                        >• {{ t('backups.role_mentionable') }}</span
                      >
                      <span v-if="role.hoist"
                        >• {{ t('backups.role_hoist') }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-section">
                {{ t('backups.no_roles') }}
              </div>
            </div>
          </div>

          <!-- Емодзі -->
          <div class="modal-section">
            <div
              class="modal-section-header"
              @click="expandedSections.emojis = !expandedSections.emojis"
            >
              <div class="modal-section-title">
                <i class="fas fa-smile" />
                {{ t('backups.section_emojis') }}
                <span class="section-count">
                  {{ getEmojis(getCurrentBackup()).length }}
                </span>
              </div>
              <i
                class="fas fa-chevron-down"
                :class="{ rotated: expandedSections.emojis }"
              />
            </div>
            <div
              class="modal-section-content"
              :class="{ expanded: expandedSections.emojis }"
            >
              <div
                v-if="getEmojis(getCurrentBackup()).length"
                class="modal-items"
              >
                <div
                  v-for="emoji in getEmojis(getCurrentBackup())"
                  :key="emoji.id"
                  class="modal-item"
                >
                  <div class="modal-item-icon">
                    <img
                      v-if="emoji.url"
                      :src="emoji.url"
                      :alt="emoji.name"
                      class="emoji-preview"
                    />
                    <i v-else class="fas fa-image" />
                  </div>
                  <div class="modal-item-info">
                    <div class="modal-item-name">:{{ emoji.name }}:</div>
                    <div class="modal-item-meta">
                      <span v-if="emoji.animated">{{
                        t('backups.emoji_animated')
                      }}</span>
                      <span v-else>{{ t('backups.emoji_static') }}</span>
                      <span v-if="emoji.managed"
                        >• {{ t('backups.emoji_managed') }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-section">
                {{ t('backups.no_emojis') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer-component />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import HeaderComponent from '@/components/layout/Header.vue';
import FooterComponent from '@/components/layout/Footer.vue';
import { apiFetch } from '@/api'; // Переконайся, що шлях правильний

const { t } = useI18n();

// === РЕАКТИВНІ ДАНІ (замість data() { return { ... } }) ===
const backups = ref([]);
const loading = ref(true);
const isCreatingBackup = ref(false);
const modalBackupId = ref(null);
const expandedBackup = ref(null); // Додано, бо використовувалося в методах, але не було в data
const expandedSections = ref({
  roles: true,
  channels: true,
  emojis: true,
});
const loadingDetails = ref({});

// === ЖИТТЄВИЙ ЦИКЛ (замість mounted) ===
onMounted(() => {
  loadBackups();
});

// === МЕТОДИ (тепер це звичайні стрілочні функції) ===

// --- Обробка Ролей ---
const getRoleColor = (color) => {
  try {
    if (typeof color === 'string' && color.startsWith('#')) return color;
    if (typeof color === 'number' && color > 0)
      return `#${color.toString(16).padStart(6, '0')}`;
    return '#99aab5';
  } catch (error) {
    console.error('Помилка обробки кольору:', color, error);
    return '#99aab5';
  }
};

const getRoles = (backup) => {
  if (!backup.details?.roles) return [];
  const roles = backup.details.roles;
  return Array.isArray(roles) ? roles : Object.values(roles);
};

// --- Обробка Емодзі ---
const getEmojis = (backup) => {
  if (!backup.details?.emojis) return [];
  const emojis = backup.details.emojis;
  return Array.isArray(emojis) ? emojis : Object.values(emojis);
};

// --- Обробка Каналів ---
const getChannels = (backup) => {
  if (!backup.details?.channels) return [];
  const channelsData = backup.details.channels;
  let allChannels = [];

  if (channelsData.categories && Array.isArray(channelsData.categories)) {
    channelsData.categories.forEach((category) => {
      allChannels.push({ ...category, type: 4, isCategory: true });
      if (category.children && Array.isArray(category.children)) {
        category.children.forEach((child) => {
          allChannels.push({
            ...child,
            parentCategory: category.name,
            isCategory: false,
          });
        });
      }
    });
  }

  if (channelsData.others && Array.isArray(channelsData.others)) {
    channelsData.others.forEach((channel) => {
      allChannels.push({ ...channel, isCategory: false, parentCategory: null });
    });
  }

  return allChannels;
};

const getCategories = (backup) => {
  return backup.details?.channels?.categories || [];
};

const countChannels = (backup) => {
  return getChannels(backup).filter((c) => !c.isCategory).length;
};

const countCategories = (backup) => {
  return getCategories(backup).length;
};

// --- Дизайн каналів ---
const getChannelIcon = (channel) => {
  if (channel.isCategory) return 'fas fa-folder';
  if (channel.type === 0) return 'fas fa-hashtag';
  if (channel.type === 2) return 'fas fa-volume-up';
  return 'fas fa-question';
};

const getChannelTypeText = (channel) => {
  if (channel.isCategory) return 'категорія';
  if (channel.type === 0) return 'текстовий';
  if (channel.type === 2) return 'голосовий';
  return 'невідомий';
};

const getChannelTypeName = (channel) => {
  if (channel.isCategory) return 'Категорія';
  if (channel.type === 0) return 'Текстовий';
  if (channel.type === 2) return 'Голосовий';
  return 'Невідомий';
};

const getChannelBadgeClass = (channel) => {
  if (channel.isCategory) return 'badge-category';
  if (channel.type === 0) return 'badge-text';
  if (channel.type === 2) return 'badge-voice';
  return 'badge-text';
};

// --- Модальне вікно та секції ---
const openBackupModal = (backupId) => {
  modalBackupId.value = backupId;
  loadBackupDetails(backupId);
};

const closeBackupModal = () => {
  modalBackupId.value = null;
};

const getCurrentBackup = () => {
  return backups.value.find((b) => b.id === modalBackupId.value);
};

const toggleBackup = (backupId) => {
  if (expandedBackup.value === backupId) {
    expandedBackup.value = null;
  } else {
    expandedBackup.value = backupId;
    const backup = backups.value.find((b) => b.id === backupId);
    if (backup && !backup.details) {
      loadBackupDetails(backupId);
    }
  }
};

const toggleSection = (backupId, sectionName) => {
  if (!expandedSections.value[backupId]) {
    expandedSections.value[backupId] = {};
  }

  const isExpanding = !expandedSections.value[backupId][sectionName];
  expandedSections.value[backupId][sectionName] = isExpanding;

  if (isExpanding) {
    const backup = backups.value.find((b) => b.id === backupId);
    if (backup && !backup.details) {
      loadBackupDetails(backupId);
    }
  }
};

const isSectionExpanded = (backupId, sectionName) => {
  return expandedSections.value[backupId]?.[sectionName] || false;
};

// --- API Запити ---
const loadBackups = async () => {
  try {
    loading.value = true;
    const response = await apiFetch('/api/backups');

    if (response.ok) {
      const data = await response.json();
      backups.value = data.backups || [];
      loadAllBackupsDetails();
    } else {
      showNotification('Помилка завантаження резервних копій', 'error');
    }
  } catch (error) {
    console.error('Помилка:', error);
    showNotification('Помилка мережі', 'error');
  } finally {
    loading.value = false;
  }
};

const loadAllBackupsDetails = async () => {
  const detailPromises = backups.value.map(async (backup, index) => {
    try {
      if (!backup.details) {
        const response = await apiFetch(`/api/backups/${backup.id}/details`);
        if (response.ok) {
          const data = await response.json();
          backups.value[index].details = data.details || data;
        }
      }
    } catch (error) {
      console.error(`Помилка завантаження деталей для ${backup.id}:`, error);
    }
  });
  await Promise.allSettled(detailPromises);
};

const loadBackupDetails = async (backupId) => {
  try {
    const response = await apiFetch(`/api/backups/${backupId}/details`);
    if (response.ok) {
      const data = await response.json();
      const backupIndex = backups.value.findIndex((b) => b.id === backupId);
      if (backupIndex !== -1) {
        backups.value[backupIndex].details = data.details || data;
      }
    } else {
      showNotification(
        `Помилка завантаження деталей: ${response.status}`,
        'error'
      );
    }
  } catch (error) {
    showNotification('Помилка мережі при завантаженні деталей', 'error');
  }
};

const createBackup = async () => {
  try {
    isCreatingBackup.value = true;
    const response = await apiFetch('/api/backups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const newBackup = await response.json();
      backups.value.unshift(newBackup);
      showNotification('Резервну копію створено!', 'success');
    } else {
      throw new Error('Помилка створення бекапу');
    }
  } catch (error) {
    showNotification('Помилка створення бекапу', 'error');
  } finally {
    isCreatingBackup.value = false;
  }
};

const restoreBackup = async (backupId, guildId) => {
  if (
    !confirm(
      `Відновити цю копію на сервер ${guildId}? Поточні налаштування будуть втрачені.`
    )
  )
    return;

  try {
    const response = await apiFetch(
      `/api/guild/${guildId}/backups/${backupId}/restore`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId }),
      }
    );

    if (response.ok) {
      showNotification('Відновлення розпочато...', 'success');
    } else {
      throw new Error('Помилка відновлення');
    }
  } catch (error) {
    showNotification('Помилка відновлення бекапу', 'error');
  }
};

const downloadBackup = async (backupId) => {
  try {
    const response = await apiFetch(`/api/backups/${backupId}/download`);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${backupId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } else {
      showNotification('Функція завантаження тимчасово недоступна', 'error');
    }
  } catch (error) {
    showNotification('Помилка завантаження', 'error');
  }
};

const deleteBackup = async (backupId) => {
  if (!confirm('Ви впевнені, що хочете видалити цю резервну копію?')) return;

  try {
    const response = await apiFetch(`/api/backups/${backupId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      backups.value = backups.value.filter((b) => b.id !== backupId);
      showNotification('Бекап видалено', 'success');
    } else {
      throw new Error('Помилка видалення');
    }
  } catch (error) {
    showNotification('Помилка видалення бекапу', 'error');
  }
};

const shareBackup = (backupId) => {
  const backup = backups.value.find((b) => b.id === backupId);
  if (backup?.shareId) {
    navigator.clipboard.writeText(
      `${window.location.origin}/backups/share/${backup.shareId}`
    );
    showNotification('Посилання скопійовано', 'success');
  } else {
    showNotification('Неможливо поділитися цим бекапом', 'error');
  }
};

// --- Утиліти ---
const getBackupIcon = (type) => {
  const icons = {
    full: 'fas fa-database',
    settings: 'fas fa-cogs',
    auto: 'fas fa-robot',
    manual: 'fas fa-user',
  };
  return icons[type] || 'fas fa-archive';
};

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleString('uk-UA');
  } catch {
    return 'Невідома дата';
  }
};

// Система сповіщень (нативних DOM-елементів)
const showNotification = (message, type = 'info') => {
  document.querySelectorAll('.custom-notification').forEach((n) => n.remove());

  const notification = document.createElement('div');
  notification.className = 'custom-notification';
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem;
    background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : '#3b82f6'};
    color: white; border-radius: 8px; z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-family: inherit; font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 3000);
};
</script>

<style scoped>
@import '../styles/user-backups.css';
</style>
