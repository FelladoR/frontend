<template>
  <meta charset="UTF-8" />
  <title>Умови користування - AntiLink</title>
  <link rel="stylesheet" href="/src/styles/terms.css" />
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
              <h1>{{ t('tos.main_title') }}</h1>

              <p>{{ t('tos.intro_text') }}</p>

              <h2>{{ t('tos.general_provisions_title') }}</h2>

              <p>
                {{ t('tos.general_provisions_desc') }}
              </p>

              <ul>
                <li>{{ t('tos.agreement_tos') }}</li>
                <li>{{ t('tos.agreement_privacy') }}</li>
                <li>{{ t('tos.agreement_discord') }}</li>
              </ul>

              <blockquote>
                <strong>{{ t('tos.disagreement_warning') }}</strong>
              </blockquote>

              <h2>{{ t('tos.prohibited_actions_title') }}</h2>

              <div class="warning-block">
                <p>{{ t('tos.penalties_text') }}</p>
                <ul>
                  <li>{{ t('tos.penalty_removal') }}</li>
                  <li>{{ t('tos.penalty_blacklist') }}</li>
                  <li>{{ t('tos.penalty_other') }}</li>
                </ul>
              </div>

              <ol>
                <li>
                  <strong>{{ t('tos.prohibited_1_title') }}</strong>
                  {{ t('tos.prohibited_1_desc') }}
                </li>
                <li>
                  <strong>{{ t('tos.prohibited_2_title') }}</strong>
                  {{ t('tos.prohibited_2_desc') }}
                </li>
                <li>
                  <strong>{{ t('tos.prohibited_3_title') }}</strong>
                  {{ t('tos.prohibited_3_desc') }}
                </li>
              </ol>

              <div class="note">
                <p>
                  {{ t('tos.changes_note') }}
                </p>
              </div>

              <h2>{{ t('tos.blacklist_title') }}</h2>

              <p>
                {{ t('tos.blacklist_desc') }}
              </p>

              <ul>
                <li>{{ t('tos.blacklist_reason_1') }}</li>
                <li>{{ t('tos.blacklist_reason_2') }}</li>
                <li>{{ t('tos.blacklist_reason_3') }}</li>
                <li>
                  {{ t('tos.blacklist_reason_4') }}
                </li>
                <li>{{ t('tos.blacklist_reason_5') }}</li>
                <li>
                  <strong>{{ t('tos.blacklist_reason_6_title') }}</strong>
                  {{ t('tos.blacklist_reason_6_desc') }}
                </li>
              </ul>

              <h2>{{ t('tos.access_restrictions_title') }}</h2>

              <p>
                {{ t('tos.access_restrictions_desc') }}
              </p>

              <ol>
                <li>{{ t('tos.restriction_reason_1') }}</li>
                <li>
                  {{ t('tos.restriction_reason_2') }}
                </li>
                <li>{{ t('tos.restriction_reason_3') }}</li>
                <li>{{ t('tos.restriction_reason_4') }}</li>
              </ol>

              <hr />
            </div>
          </div>
        </div>
      </main>

      <footer-component />
    </div>
  </body>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import HeaderComponent from '@/components/layout/Header.vue';
import FooterComponent from '@/components/layout/Footer.vue';

const { t } = useI18n();
</script>
