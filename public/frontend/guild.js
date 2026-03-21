import HeaderComponent from "./headerComponent.js";
import FooterComponent from "./footerComponent.js";
import { apiFetch } from "./utils/api.js";

const { createApp } = Vue;
const app = createApp({
  components: {
    "header-component": HeaderComponent,
    "footer-component": FooterComponent,
  },
  data() {
    return {
      cooldownRemaining: 0,
      isCooldown: false,
      cooldownMessage: null, 
      restoringId: null,
      cooldownId: null,
      cooldownTime: 0,
      guild: null,
      hasAdminPermissions: false,
      showWebhookUrl: false,
      guildId: window.location.pathname.split("/")[2],
      webhooks: [],
      channels: [],
      roles: [],
      currentWebhook: null,
      activeTab: "main",
      isLoading: true,
      isSaving: false,
      rolesLoading: false,
      error: null,
      webhookError: null,
      successMessage: null,
      loadingProgress: 0,
      whitelistRoles: [],
      roleQuery: "", // пошук по ролям у UI
      loggingSettings: {
        webhookId: null,
        messageDelete: true,
        messageEdit: true,
        memberJoin: true,
        memberLeave: true,
      },
      mainSettings: {
        language: "en",
        antiRaid: false,
        autoMod: false,
        backupInterval: "off",
      },
      backups: {
        autoBackups: "off",
        list: [],
        loading: false,
        creating: false,
      },
      verificationSettings: {
        verifiedRole: null,
        unverifiedRole: null,
        verificationChannel: null,
        captchaEnabled: false,
      },
      verificationSuccessMessage: null,
    };
  },

  setup() {

    const { t } = VueI18n.useI18n();

    return {
      t
    };
  },

  computed: {
    isVerificationActive() {
      return (
        this.isVerificationSetupComplete &&
        (this.verificationSettings.captchaEnabled ||
          this.verificationSettings.verifiedRole ||
          this.verificationSettings.unverifiedRole)
      );
    },
    availableRoles() {
      return this.roles.filter(
        (role) => !role.managed && role.name !== "@everyone"
      );
    },
    textChannels() {
      return this.channels.filter((c) => c.type === 0);
    },
    isVerificationSetupComplete() {
      return (
        this.verificationSettings.verifiedRole &&
        this.verificationSettings.unverifiedRole &&
        this.verificationSettings.verificationChannel
      );
    },
    // Пошук/фільтр ролей для UI (використовує availableRoles, яка вже є)
    filteredRoles() {
      const q = (this.roleQuery || "").toString().trim().toLowerCase();
      if (!q) return this.availableRoles;
      return this.availableRoles.filter((r) =>
        (r.name || "").toString().toLowerCase().includes(q)
      );
    },
  },
  methods: {
    async checkCooldown() {
      try {
        const response = await apiFetch("/guild/cooldown", {
          credentials: "include",
        });
        const data = await response.json();

        if (data.hasCooldown && data.remaining > 0) {
          this.cooldownRemaining = Math.max(0, data.remaining);
          this.isCooldown = true;
          this.startCooldownTimer();
          return true;
        } else {
          this.isCooldown = false;
          this.cooldownRemaining = 0;
          this.cooldownMessage = null;
          return false;
        }
      } catch (error) {
        console.error("Помилка перевірки cooldown:", error);
        return false;
      }
    },

    async loadBackups() {
      this.backups.loading = true;
      this.backups.list = [];

      try {
        const response = await apiFetch(`/api/guild/${this.guildId}/backups`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Помилка сервера: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        if (result.hasAdminPerms === true) {
          this.hasAdminPermissions = true;
        } else {
          this.hasAdminPermissions = false;
        }

        const backupsData = Array.isArray(result) ? result : result.data || [];

        this.backups.list = backupsData.map((backup) => ({
          id: backup.backupId,
          backupId: backup.backupId,
          name:
            backup.name ||
            `Бекап від ${new Date(backup.createdAt).toLocaleDateString()}`,
          createdAt: backup.createdAt,
          size: backup.size || 0,
          status: "completed",
        }));
      } catch (error) {
        console.error("Помилка завантаження бекапів:", error);
        this.error = error.message;
      } finally {
        this.backups.loading = false;
      }
    },

    async confirmCreateBackup() {
      if (confirm("Ви впевнені, що хочете створити нову резервну копію?")) {
        await this.createBackup();
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    },

    formatSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },

    getStatusText(status) {
      const statusMap = {
        completed: "Успішно",
        pending: "В очікуванні",
        failed: "Помилка",
      };
      return statusMap[status] || status;
    },

    async createBackup() {
      this.backups.creating = true;
      this.error = null;
      this.successMessage = null;

      try {
        if (this.isCooldown && this.cooldownRemaining > 0) {
          this.error = this.cooldownMessage;
          return;
        }
        const response = await apiFetch(
          `/api/guild/${this.guildId}/create_backup`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Помилка сервера");
        }

        const newBackup = await response.json();
        const backupData = newBackup.result || newBackup.data || newBackup;

        if (!backupData.id && !backupData.backupId) {
          throw new Error("Невірний формат відповіді від сервера");
        }

        this.backups.list.unshift({
          id: backupData.id || backupData.backupId,
          backupId: backupData.backupId || backupData.id,
          name:
            backupData.name || `Бекап від ${new Date().toLocaleDateString()}`,
          createdAt: backupData.createdAt || new Date().toISOString(),
          size: backupData.size || 0,
          status: backupData.status || "completed",
        });

        this.successMessage = "Резервну копію успішно створено!";
        setTimeout(() => (this.successMessage = null), 5000);
      } catch (error) {
        console.error("Помилка створення бекапу:", error);
        this.error = error.message || "Невідома помилка";
        setTimeout(() => (this.error = null), 5000);
      } finally {
        this.backups.creating = false;
      }
    },

    async confirmRestoreBackup(id) {
      this.restoringId = id;
      try {
        const response = await apiFetch(
          `/api/guild/${this.guildId}/backups/${id}/restore`,
          {
            // ← Виправлений шлях
            method: "POST",
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json(); // Додайте цей рядок для отримання деталей помилки
          throw new Error(errorData.error || "Failed to restore backup");
        }
        // ... решта коду
      } catch (e) {
        console.error("Деталі помилки:", e.message); // ← Виведіть повідомлення помилки
        this.error = e.message; // Покажіть помилку в інтерфейсі
      }
    },

    startCooldown() {
      this.isCooldown = true;
      this.cooldownTime = 10;

      this.cooldownTimer = setInterval(() => {
        this.cooldownTime--;

        if (this.cooldownTime <= 0) {
          clearInterval(this.cooldownTimer);
          this.isCooldown = false;
        }
      }, 1000);
    },

    beforeDestroy() {
      if (this.cooldownTimer) {
        clearInterval(this.cooldownTimer);
      }
    },

    async restoreBackup(backupId) {
      try {
        const hasCooldown = await this.checkCooldown();
        if (hasCooldown) {
          this.error = `Зачекайте ${this.cooldownRemaining} секунд перед наступною дією`;
          return;
        }

        const response = await apiFetch(
          `/api/guild/${this.guildId}/backups/${backupId}/restore`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Не вдалося відновити бекап");
        }

        this.successMessage =
          result.message || "Резервну копію успішно відновлено!";
        setTimeout(() => (this.successMessage = null), 5000);

        this.loadGuildData();
      } catch (error) {
        console.error("Помилка відновлення бекапу:", error);
        this.error = error.message;
        setTimeout(() => (this.error = null), 5000);
      }
    },

    async confirmDeleteBackup(backupId) {
      const backup = this.backups.list.find((b) => b.backupId === backupId);
      if (
        backup &&
        confirm(
          `Ви впевнені, що хочете видалити резервну копію від ${this.formatDate(
            backup.createdAt
          )}? Цю дію неможливо скасувати.`
        )
      ) {
        await this.deleteBackup(backupId);
      }
    },

    async deleteBackup(backupId) {
      try {
        const response = await apiFetch(`/api/backups/${backupId}`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Не вдалося видалити бекап");
        }

        this.backups.list = this.backups.list.filter((b) => b.id !== backupId);
        this.successMessage = "Резервну копію успішно видалено!";
        setTimeout(() => (this.successMessage = null), 5000);
      } catch (error) {
        console.error("Помилка видалення бекапу:", error);
        this.error = error.message;
        setTimeout(() => (this.error = null), 5000);
      }
    },

    startCooldownTimer() {
      if (this.cooldownTimer) clearInterval(this.cooldownTimer);

      this.cooldownTimer = setInterval(() => {
        this.cooldownRemaining--;

        if (this.cooldownRemaining <= 0) {
          clearInterval(this.cooldownTimer);
          this.isCooldown = false;
          this.cooldownMessage = null;
        } else {
          this.cooldownMessage = `Зачекайте ${this.cooldownRemaining} секунд перед наступною дією`;
        }
      }, 1000);
    },

    async handleRestore() {
      if (this.isRestoring || this.cooldownRemaining > 0) return;

      this.isRestoring = true;

      try {
        const response = await apiFetch(
          `/guild/${this.guildId}/backups/${this.backupId}/restore`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to restore");
        }

        if (data.cooldownExpires) {
          this.cooldownRemaining = Math.ceil(
            (data.cooldownExpires - Date.now()) / 1000
          );
          this.startCooldownTimer();
        }

        this.successMessage = data.message;
        setTimeout(() => (this.successMessage = null), 3000);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          this.cooldownRemaining = Math.max(
            0,
            error.response.data.cooldownRemaining
          );
          this.startCooldownTimer();
        }
        this.error = error.message || "Помилка при відновленні";
      } finally {
        this.isRestoring = false;
      }
    },

    async saveLoggingSettings() {
      this.isSaving = true;
      this.error = null;

      try {
        await this.checkAuth();

        const webhookUrl = this.loggingSettings.webhookId
          ? this.getWebhookUrl(this.loggingSettings.webhookId)
          : null;

        const response = await apiFetch(`/api/guild/${this.guildId}/settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logchannel: webhookUrl,
            messageDelete: this.loggingSettings.messageDelete,
            messageEdit: this.loggingSettings.messageEdit,
            memberJoin: this.loggingSettings.memberJoin,
            memberLeave: this.loggingSettings.memberLeave,
          }),
          credentials: "include",
        });

        if (!response.ok)
          throw new Error("Помилка збереження налаштувань логування");

        this.successMessage = "Налаштування логування збережено!";
        setTimeout(() => (this.successMessage = null), 3000);

        this.currentWebhook = this.loggingSettings.webhookId
          ? this.webhooks.find((w) => w.id === this.loggingSettings.webhookId)
          : null;
      } catch (error) {
        console.error("Помилка збереження:", error);
        this.error = error.message;
        if (error.message.includes("Необхідно авторизуватися")) {
          this.error += ". Перенаправлення на сторінку входу...";
          setTimeout(() => (window.location.href = "/"), 3000);
        }
      } finally {
        this.isSaving = false;
      }
    },

    async checkAuth() {
      const response = await apiFetch("/api/auth/user", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Необхідно авторизуватися");
      }
    },

    getRoleName(roleId) {
      const role = this.roles.find((r) => r.id === roleId);
      return role ? role.name : null;
    },

    getRoleColor(roleId) {
      const role = this.roles.find((r) => r.id === roleId);
      return role ? role.color.toString(16).padStart(6, "0") : "ffffff";
    },

    goBack() {
      window.history.back();
    },

    async loadGuildData() {
      this.isLoading = true;
      this.error = null;
      this.loadingProgress = 0;

      try {
        await this.checkAuth();
        this.loadingProgress = 30;

        const [guildRes, fullSettingsRes, channelsRes, webhooksRes, rolesRes] =
          await Promise.all([
            apiFetch(`/api/guild/${this.guildId}`, {
              headers: { "Content-Type": "application/json" },
            }),
            apiFetch(`/api/guild/${this.guildId}/full-settings`),
            apiFetch(`/api/guild/${this.guildId}/channels`),
            apiFetch(`/api/guild/${this.guildId}/webhooks`),
            apiFetch(`/api/guild/${this.guildId}/roles`),
          ]);

        if (!guildRes.ok)
          throw new Error("Не вдалося завантажити дані гільдії");

        const [guildData, fullSettings] = await Promise.all([
          guildRes.json(),
          fullSettingsRes.ok ? fullSettingsRes.json() : {},
        ]);

        this.guild = guildData;
        this.loadingProgress = 60;
        console.log("fullSettings", fullSettings);
        this.mainSettings = {
          language: fullSettings.language || "en",
          antiRaid: fullSettings.antiCrashMode || false, // правильна назва
          autoMod: fullSettings.blocking_enabled || false,
          backupInterval: fullSettings.backups?.backupInterval || "off",
          isPremium: fullSettings.isPremium || false,
        };

        this.whitelistRoles = fullSettings.whitelist || [];

        if (fullSettings.logchannel) {
          const match = fullSettings.logchannel.match(
            /discord\.com\/api\/webhooks\/(\d+)\//
          );
          if (match?.[1]) {
            this.loggingSettings.webhookId = match[1];
          }
        }
        console.log(
          "Verification system raw:",
          fullSettings.verificationSystem
        );

        if (fullSettings.verificationSystem) {
          const vs = fullSettings.verificationSystem || {};
          // Підтримка різних варіантів ключів від бекенду (орфографічні помилки)
          const verifiedRole =
            vs.verifiedRoleId ||
            vs.verifedRoleId ||
            vs.verifedRoleID ||
            vs.verifedroleId ||
            null;

          const unverifiedRole =
            vs.unverifiedRoleId ||
            vs.unvefivedRoleID ||
            vs.unvefivedRoleId ||
            vs.unverifedRoleId ||
            null;

          const verificationChannel =
            vs.verificationChannel ||
            vs.captcha_channel_id ||
            vs.captchaChannelId ||
            vs.captcha_channel ||
            null;

          this.verificationSettings = {
            verifiedRole,
            unverifiedRole,
            verificationChannel,
            captchaEnabled: Boolean(vs.isEnabled),
            captcha_embed_message_id:
              vs.captcha_embed_message_id || vs.captchaEmbedMessageId || null,
          };
        }

        this.loadingProgress = 80;
        this.rolesLoading = true;
        console.log(`Налаштування гільдії`, fullSettings);

        if (channelsRes.ok) this.channels = await channelsRes.json();
        if (webhooksRes.ok) {
          const webhooksData = await webhooksRes.json();
          this.webhooks = Array.isArray(webhooksData) ? webhooksData : [];
          if (this.loggingSettings.webhookId) {
            this.currentWebhook = this.webhooks.find(
              (w) => w.id === this.loggingSettings.webhookId
            );
          }
        } else {
          this.webhooks = [];
        }
        if (rolesRes.ok) {
          const allRoles = await rolesRes.json();
          this.roles = allRoles.filter(
            (role) => !role.managed && role.name !== "@everyone"
          );
        }

        this.loadingProgress = 100;
      } catch (error) {
        console.error("Помилка завантаження:", error);
        this.error = error.message;
        // Поправлено: використовувати isLoading (було this.loading — орфографічна помилка)
        this.isLoading = false;
        if (
          error.message.includes("Доступ заборонено") ||
          error.message.includes("Необхідно авторизуватися")
        ) {
          setTimeout(() => (window.location.href = "/"), 3000);
        }
      } finally {
        this.rolesLoading = false;
        this.isLoading = false;
      }
    },

    getChannelName(channelId) {
      if (!this.channels || !channelId) return "";
      const channel = this.channels.find((c) => c.id === channelId);
      return channel ? `#${channel.name}` : channelId;
    },

    getWebhookUrl(webhookId) {
      const webhook = this.webhooks.find((w) => w.id === webhookId);
      return webhook
        ? `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}`
        : "";
    },

    copyWebhookUrl(webhookId) {
      const url = this.getWebhookUrl(webhookId);
      navigator.clipboard
        .writeText(url)
        .then(() => {
          this.successMessage = "URL вебхука скопійовано!";
          setTimeout(() => (this.successMessage = null), 3000);
        })
        .catch(() => {
          this.error = "Не вдалося скопіювати URL";
        });
    },

    validateWebhook() {
      if (
        this.loggingSettings.webhookId &&
        !this.getWebhookUrl(this.loggingSettings.webhookId)
      ) {
        this.webhookError = "Невірний ID вебхука";
        return false;
      }
      this.webhookError = null;
      return true;
    },

    async saveMainSettings() {
      this.isSaving = true;
      this.error = null;
      try {
        await this.checkAuth();

        const response = await apiFetch(`/api/guild/${this.guildId}/settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: this.mainSettings.language,
            antiCrashMode: this.mainSettings.antiRaid, // було anticrashMode
            blocking_enabled: this.mainSettings.autoMod,
            whitelist: this.whitelistRoles,
          }),

        });

        if (!response.ok)
          throw new Error("Помилка збереження основних налаштувань");

        this.successMessage = "Основні налаштування збережено!";
        setTimeout(() => (this.successMessage = null), 3000);
      } catch (error) {
        console.error("Помилка збереження:", error);
        this.error = error.message;
      } finally {
        this.isSaving = false;
      }
    },

    async saveVerificationSettings() {
      if (
        !this.verificationSettings.verifiedRole ||
        !this.verificationSettings.unverifiedRole ||
        !this.verificationSettings.verificationChannel
      ) {
        this.error = "Заповніть всі обов'язкові поля (ролі та канал)";
        return;
      }

      if (
        this.verificationSettings.verifiedRole ===
        this.verificationSettings.unverifiedRole
      ) {
        this.error =
          "Роль верифікації та роль не верифікованого користувача мають бути різні.";
        return;
      }
      this.isSaving = true;
      this.error = null;
      this.verificationSuccessMessage = null;

      try {
        await this.checkAuth();
        const response = await apiFetch(
          `/api/guild/${this.guildId}/verification`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              verifiedRole: this.verificationSettings.verifiedRole,
              unverifiedRole: this.verificationSettings.unverifiedRole,
              verificationChannel:
                this.verificationSettings.verificationChannel,
              captchaEnabled: this.verificationSettings.captchaEnabled,
              captcha_embed_message_id:
                this.verificationSettings.captcha_embed_message_id,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Помилка збереження");
        }

        this.verificationSuccessMessage =
          "Налаштування верифікації успішно збережено!";
        setTimeout(() => (this.verificationSuccessMessage = null), 3000);
      } catch (error) {
        console.error("Помилка збереження:", error);
        this.error = error.message || "Сталася помилка";
      } finally {
        this.isSaving = false;
      }
    },
  },
  async mounted() {
    console.log("mainSettings", this.mainSettings);
    console.log("verificationSettings", this.verificationSettings);

    // Помітити, що Vue змонтувався — це дозволить CSS [data-vue-mounted] показати контент
    const root = document.getElementById("app");
    if (root) {
      root.setAttribute("data-vue-mounted", "true");
      root.removeAttribute("v-cloak");
    }

    this.$nextTick(() => {
      if (!this.guildId) {
        this.error = "ID гільдії не знайдено в URL";
        this.isLoading = false;
        return;
      }
      this.loadGuildData();
      this.loadBackups();
    });
  },
  beforeUnmount() {
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);
  },
});

app.use(window.i18n);
app.mount("#app");
