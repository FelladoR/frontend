import HeaderComponent from "./headerComponent.js";
import FooterComponent from "./footerComponent.js";
const { createApp } = Vue;
import { apiFetch } from "./utils/api.js";

const app = createApp({
  components: {
    "header-component": HeaderComponent,
    "footer-component": FooterComponent,
  },
  data() {
    return {
      user: null,
      loading: true,
      guildsWithBot: [],
      initialized: false,
      error: null,
    };
  },

  setup() {

    const { t } = VueI18n.useI18n();

    return {
      t
    };
  },
  computed: {
    processedGuilds() {
      if (!this.user?.ownerGuilds) return [];

      return this.user.ownerGuilds.map((guild) => ({
        ...guild,
        botAdded: this.guildsWithBot.includes(guild.id),
        loading: !this.initialized,
      }));
    },
  },
  methods: {
    async checkBotPresence(guildId) {
      try {
        const response = await apiFetch(`/api/bot/has-bot/${guildId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        return data.hasBot;
      } catch (error) {
        console.error("Error checking bot presence:", error);
        return false;
      }
    },

    async handleGuildAction(guild, event) {
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
          window.open(inviteUrl, "_blank", "noopener,noreferrer");
        }
      } catch (error) {
        console.error("Помилка при обробці гільдії:", error);
        // Можна додати сповіщення про помилку
        alert("Сталася помилка. Будь ласка, спробуйте ще раз.");
      }
    },

    async loadUserData() {
      try {
        this.loading = true;
        this.initialized = false;
        this.error = null;

        const userRes = await apiFetch("/api/user", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!userRes.ok)
          throw new Error("Не вдалося завантажити дані користувача");

        const userData = await userRes.json();

        this.user = userData;
        // Очищаємо попередні результати
        this.guildsWithBot = [];

        // Використовуємо Promise.allSettled для стабільності
        const checks = await Promise.allSettled(
          this.user.ownerGuilds.map((guild) =>
            this.checkBotPresence(guild.id).then((hasBot) => {
              if (hasBot) {
                this.guildsWithBot.push(guild.id);
              }
            })
          )
        );

        // Перевіряємо помилки
        const errors = checks.filter((r) => r.status === "rejected");
        if (errors.length > 0) {
          console.error("Деякі перевірки завершилися з помилкою:", errors);
        }
      } catch (error) {
        console.error("Помилка завантаження:", error);
        this.error = error.message;
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } finally {
        this.loading = false;
        this.initialized = true;
      }
    },
  },
  mounted() {
    
    document.body.classList.add("vue-loading");

    this.$nextTick(() => {
      this.loadUserData().finally(() => {
        document.body.classList.remove("vue-loading");
        document.body.classList.add("vue-loaded");
      });
    });

  },
});

app.use(window.i18n);
app.mount("#app");
