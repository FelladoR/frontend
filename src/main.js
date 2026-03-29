import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import './styles/main.css';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import router from './router';
import App from './App.vue';

import uk from './i18n/locales/uk.js';
import en from './i18n/locales/en.js';

const i18n = createI18n({
  legacy: false,
  locale: 'uk',
  fallbackLocale: 'en',
  messages: { uk, en },
});

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');
