import { apiFetch } from "./utils/api.js";
import HeaderComponent from "./headerComponent.js";
import FooterComponent from "./footerComponent.js";

const { createApp, ref, computed, onMounted } = Vue;

const app = createApp({
  components: {
    "header-component": HeaderComponent,
    "footer-component": FooterComponent,
  },

  setup() {
   
    const { t } = VueI18n.useI18n();

    const guilds = ref(0);
    const members = ref(0);
    const error = ref(null);

    const formattedGuilds = computed(() => {
      try { return guilds.value.toLocaleString(); }
      catch { return String(guilds.value); }
    });

    async function fetchBotStats() {
      try {
        const response = await apiFetch("/api/bot/stats");

        const res = await response.json();
        
        if (res && res.status === "success") {
          guilds.value = res.guilds || 0;
          members.value = res.members || 0;
          error.value = null;
        } else {
          error.value = res?.error || "Помилка оновлення даних";
        }
      } catch (e) {
        error.value = e?.message || "Помилка мережі";
      }
    }

    onMounted(() => {
      fetchBotStats();
    });

    return {
      t,
      formattedGuilds,
      error,
      members
    };
  },
});

// Підключаємо I18n
app.use(window.i18n);

// Монтуємо Vue
app.mount("#app");
