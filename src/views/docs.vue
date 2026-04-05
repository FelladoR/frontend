<template>
  <header-component />

  <main class="main-content" role="main">
    <div class="container">
      <div class="settings-card" style="max-width: 1000px; margin: 28px auto">
        <div class="card-body">
          <h1 class="mb-3">
            <i class="fas fa-shield-alt me-2" />{{ t('docs.main_title') }}
          </h1>
          <p class="text-muted">
            {{ t('docs.main_description') }}
          </p>

          <div class="note">
            <p>
              <i class="fas fa-info-circle me-2" />
              {{ t('docs.note_automatic_protection') }}
            </p>
          </div>

          <h2><i class="fas fa-cogs me-2" />{{ t('docs.features_title') }}</h2>
          <ul>
            <li>
              <strong>{{ t('docs.feature_unwanted_users') }}:</strong>
              {{ t('docs.feature_unwanted_users_desc') }}
            </li>
            <li>
              <strong>{{ t('docs.feature_warning_system') }}:</strong>
              {{ t('docs.feature_warning_system_desc') }}
            </li>
            <li>
              <strong>{{ t('docs.feature_blacklist') }}:</strong>
              {{ t('docs.feature_blacklist_desc') }}
            </li>
            <li>
              <strong>{{ t('docs.feature_cross_server') }}:</strong>
              {{ t('docs.feature_cross_server_desc') }}
            </li>
            <li>
              <strong>{{ t('docs.feature_crash_bots') }}:</strong>
              {{ t('docs.feature_crash_bots_desc') }}
            </li>
          </ul>

          <h2>
            <i class="fas fa-user-shield me-2" />{{
              t('docs.work_concept_title')
            }}
          </h2>
          <ol>
            <li>{{ t('docs.concept_step1') }}</li>
            <li>
              {{ t('docs.concept_step2') }}
            </li>
            <li>
              <span class="highlight">{{
                t('docs.concept_step3_highlight')
              }}</span>
              {{ t('docs.concept_step3_text') }}
            </li>
            <li>
              {{ t('docs.concept_step4') }}
            </li>
          </ol>

          <div class="warning-block">
            <p>
              <i class="fas fa-exclamation-triangle me-2" />
              {{ t('docs.warning_blacklist') }}
            </p>
          </div>

          <div class="warning-block">
            <p>
              <i class="fas fa-exclamation-triangle me-2" />
              {{ t('docs.warning_default_settings') }}
            </p>
          </div>

          <h2>
            <i class="fas fa-list-check me-2" />{{ t('docs.whitelist_title') }}
          </h2>

          <div class="note">
            <p>
              <i class="fas fa-circle-check me-2" />
              {{ t('docs.whitelist_note') }}
            </p>
          </div>

          <ul>
            <li>
              <strong>{{ t('docs.whitelist_add') }}:</strong>
              <code>/setup whitelist @{{ t('docs.role') }}</code>
            </li>
            <li>
              <strong>{{ t('docs.whitelist_remove') }}:</strong>
              <code>/setup whitelist_remove @{{ t('docs.role') }}</code>
            </li>
          </ul>

          <div class="warning-block">
            <p>
              <i class="fas fa-exclamation-circle me-2" />
              {{ t('docs.whitelist_warning') }}
            </p>
          </div>

          <p>
            {{ t('docs.whitelist_permissions') }}
          </p>

          <h2>
            <i class="fas fa-sliders-h me-2" />{{
              t('docs.settings_management_title')
            }}
          </h2>

          <div class="command">
            <div class="command-icon">
              <i class="fas fa-terminal" />
            </div>
            <div>
              <code>/settings</code> - {{ t('docs.command_settings') }}

              <br />
              <span class="text-muted">{{ t('docs.command_owner_only') }}</span>
            </div>
            <div>
              <code>/setup</code> - {{ t('docs.command_setup') }}

              <br />
              <span class="text-muted">{{ t('docs.command_owner_only') }}</span>
            </div>
          </div>

          <p>
            {{ t('docs.web_panel_text') }}
            <a href="/" class="highlight">{{ t('docs.web_panel_link') }}</a
            >{{ t('docs.web_panel_text_after') }}
          </p>

          <div class="note">
            <p>
              <i class="fas fa-lock me-2" />
              <strong>{{ t('docs.note_attention') }}:</strong>
              {{ t('docs.note_owner_only') }}
            </p>
          </div>

          <h2>
            <i class="fas fa-database me-2" />{{
              t('docs.user_database_title')
            }}
          </h2>
          <p>{{ t('docs.user_database_desc') }}</p>
          <ul>
            <li>{{ t('docs.db_field_date') }}</li>
            <li>{{ t('docs.db_field_type') }}</li>
            <li>{{ t('docs.db_field_user_id') }}</li>
            <li>{{ t('docs.db_field_moderator') }}</li>
            <li>{{ t('docs.db_field_notes') }}</li>
          </ul>

          <hr />
        </div>
      </div>
    </div>
  </main>
  <footer-component />
</template>

<script setup>
import { useI18n } from 'vue-i18n'; // 1. Імпортуємо модуль перекладу
import HeaderComponent from '@/components/layout/Header.vue';
import FooterComponent from '@/components/layout/Footer.vue';

// 2. Ініціалізуємо функцію t
const { t } = useI18n();
</script>

<style scoped>
@import '../styles/docs.css';
</style>
