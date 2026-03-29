<template>
  <meta charset="UTF-8" />
  <title>Політика конфіденційності - AntiLink</title>

  <body>
    <div v-cloak id="app">
      <header-component />

      <main class="main-content" role="main">
        <div class="container">
          <div
            class="settings-card"
            style="max-width: 1000px; margin: 28px auto"
          >
            <div class="card-body">
              <h1 class="mb-3">
                {{ t('privacy.main_title') }}
              </h1>

              <p>
                {{ t('privacy.intro_text') }}
              </p>

              <div class="highlight-box">
                <p>
                  {{ t('privacy.priority_text') }}
                </p>
              </div>

              <h2>{{ t('privacy.data_collection_title') }}</h2>

              <p>
                {{ t('privacy.data_collection_desc') }}
              </p>

              <ul>
                <li>
                  <strong>{{ t('privacy.data_discord_id') }}</strong>
                  {{ t('privacy.data_discord_id_desc') }}
                </li>
                <li>
                  <strong>{{ t('privacy.data_server_id') }}</strong>
                  {{ t('privacy.data_server_id_desc') }}
                </li>
                <li>
                  <strong>{{ t('privacy.data_role_id') }}</strong>
                  {{ t('privacy.data_role_id_desc') }}
                </li>
                <li>
                  <strong>{{ t('privacy.data_evidence') }}</strong>
                  {{ t('privacy.data_evidence_desc') }}
                </li>
              </ul>

              <div class="highlight-box">
                <p v-html="t('privacy.important_note')" />
                <ul>
                  <li>{{ t('privacy.not_collected_real_names') }}</li>
                  <li>{{ t('privacy.not_collected_emails') }}</li>
                  <li>{{ t('privacy.not_collected_phones') }}</li>
                  <li>{{ t('privacy.not_collected_addresses') }}</li>
                  <li>{{ t('privacy.not_collected_payment') }}</li>
                </ul>
              </div>

              <p>
                <em>{{ t('privacy.last_updated') }}</em>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </body>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import HeaderComponent from '@/components/layout/Header.vue';
// import FooterComponent from '@/components/layout/Footer.vue';

const { t } = useI18n();
</script>

<style scoped>
@import '../styles/privacy.css';
</style>
