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
      
      backups: [],
      loading: true,
      isCreatingBackup: false,
      modalBackupId: null,
      expandedSections: {
        roles: true,
        channels: true,
        emojis: true,
      },
      loadingDetails: {}, // Додайте цей об'єкт для відстеження завантаження
    };
  },

  setup() {
    
    const { t } = VueI18n.useI18n();

    return {
      t
    };

  },
  mounted() {
    this.loadBackups();
  },
  methods: {
    getRoleColor(color) {
      try {
        // Якщо колір вже у HEX форматі
        if (typeof color === "string" && color.startsWith("#")) {
          return color;
        }

        // Якщо колір - число
        if (typeof color === "number" && color > 0) {
          return `#${color.toString(16).padStart(6, "0")}`;
        }

        // Сірий колір за замовчуванням
        return "#99aab5";
      } catch (error) {
        console.error("Помилка обробки кольору:", color, error);
        return "#99aab5";
      }
    },
    getRoles(backup) {
      if (!backup.details) {
        console.log("Немає деталей у бекапу:", backup.id);
        return [];
      }

      console.log("Деталі бекапу для ролей:", backup.details);

      let roles = backup.details.roles;

      if (!roles) {
        console.log("Ролі відсутні в деталях");
        return [];
      }

      if (Array.isArray(roles)) {
        console.log("Ролі у форматі масиву:", roles.length);
        return roles;
      } else if (roles && typeof roles === "object") {
        const rolesArray = Object.values(roles);
        console.log(
          "Ролі у форматі об'єкта, конвертовано в масив:",
          rolesArray.length
        );
        return rolesArray;
      }

      console.log("Невідомий формат ролей:", typeof roles);
      return [];
    },
    // Методи для емодзі
    getEmojis(backup) {
      if (!backup.details) return [];

      const emojis = backup.details.emojis;
      if (Array.isArray(emojis)) {
        return emojis;
      } else if (emojis && typeof emojis === "object") {
        return Object.values(emojis);
      }
      return [];
    },

    // Методи для каналів
    getChannels(backup) {
      if (!backup.details || !backup.details.channels) return [];

      const channelsData = backup.details.channels;
      let allChannels = [];

      // Обробляємо категорії та їх дочірні канали
      if (channelsData.categories && Array.isArray(channelsData.categories)) {
        channelsData.categories.forEach((category) => {
          // Додаємо саму категорію
          allChannels.push({
            ...category,
            type: 4, // Категорія
            isCategory: true,
          });

          // Додаємо дочірні канали
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

      // Додаємо інші канали (без категорій)
      if (channelsData.others && Array.isArray(channelsData.others)) {
        channelsData.others.forEach((channel) => {
          allChannels.push({
            ...channel,
            isCategory: false,
            parentCategory: null,
          });
        });
      }

      return allChannels;
    },

    // Методи для підрахунку
    countChannels(backup) {
      const channels = this.getChannels(backup);
      return channels.filter((channel) => !channel.isCategory).length;
    },

    countCategories(backup) {
      const categories = this.getCategories(backup);
      return categories.length;
    },

    getCategories(backup) {
      if (!backup.details || !backup.details.channels) return [];
      return backup.details.channels.categories || [];
    },

    // Інші методи для обробки даних
    getRoleColor(color) {
      try {
        // Якщо колір вже у HEX форматі
        if (typeof color === "string" && color.startsWith("#")) {
          return color;
        }

        // Якщо колір - число
        if (typeof color === "number" && color > 0) {
          return `#${color.toString(16).padStart(6, "0")}`;
        }

        // Сірий колір за замовчуванням
        return "#99aab5";
      } catch (error) {
        console.error("Помилка обробки кольору:", color, error);
        return "#99aab5";
      }
    },

    getChannelIcon(channel) {
      if (channel.isCategory) return "fas fa-folder";
      if (channel.type === 0) return "fas fa-hashtag";
      if (channel.type === 2) return "fas fa-volume-up";
      if (channel.type === 4) return "fas fa-folder";
      return "fas fa-question";
    },

    getChannelTypeText(channel) {
      if (channel.isCategory) return "категорія";
      if (channel.type === 0) return "текстовий";
      if (channel.type === 2) return "голосовий";
      if (channel.type === 4) return "категорія";
      return "невідомий";
    },

    getChannelBadgeClass(channel) {
      if (channel.isCategory) return "badge-category";
      if (channel.type === 0) return "badge-text";
      if (channel.type === 2) return "badge-voice";
      if (channel.type === 4) return "badge-category";
      return "badge-text";
    },

    getChannelTypeName(channel) {
      if (channel.isCategory) return "Категорія";
      if (channel.type === 0) return "Текстовий";
      if (channel.type === 2) return "Голосовий";
      if (channel.type === 4) return "Категорія";
      return "Невідомий";
    },

    // === МЕТОДИ ДЛЯ МОДАЛЬНОГО ВІКНА ===
    openBackupModal(backupId) {
      this.modalBackupId = backupId;
      this.loadBackupDetails(backupId);
    },

    closeBackupModal() {
      this.modalBackupId = null;
    },

    getCurrentBackup() {
      return this.backups.find((b) => b.id === this.modalBackupId);
    },

    toggleBackup(backupId) {
      if (this.expandedBackup === backupId) {
        this.expandedBackup = null;
      } else {
        this.expandedBackup = backupId;
        // Автоматично завантажуємо деталі при розгортанні
        const backup = this.backups.find((b) => b.id === backupId);
        if (backup && !backup.details) {
          console.log("Завантаження деталей для бекапу:", backupId);
          this.loadBackupDetails(backupId);
        }
      }
    },

    toggleSection(backupId, sectionName) {
      if (!this.expandedSections[backupId]) {
        this.expandedSections[backupId] = {};
      }

      const isExpanding = !this.expandedSections[backupId][sectionName];
      this.expandedSections[backupId][sectionName] = isExpanding;

      // Якщо розгортаємо секцію і деталей ще немає - завантажуємо
      if (isExpanding) {
        const backup = this.backups.find((b) => b.id === backupId);
        if (backup && !backup.details) {
          this.loadBackupDetails(backupId);
        }
      }
    },

    isSectionExpanded(backupId, sectionName) {
      return (
        this.expandedSections[backupId] &&
        this.expandedSections[backupId][sectionName]
      );
    },

    async loadBackups() {
      try {
        this.loading = true;
        console.log("Loading backups...");

        const response = await apiFetch("/api/backups");

        if (response.ok) {
          const data = await response.json();
          this.backups = data.backups || [];
          console.log("Backups loaded:", this.backups);

          // АВТОМАТИЧНЕ ЗАВАНТАЖЕННЯ ДЕТАЛЕЙ ДЛЯ ВСІХ БЕКАПІВ
          this.loadAllBackupsDetails();
        } else {
          console.error("Помилка завантаження бекапів:", response.status);
          this.showNotification(
            "Помилка завантаження резервних копій",
            "error"
          );
        }
      } catch (error) {
        console.error("Помилка:", error);
        this.showNotification("Помилка мережі", "error");
      } finally {
        this.loading = false;
      }
    },

    // Додайте цей метод після loadBackups
    async loadAllBackupsDetails() {
      console.log("Автоматичне завантаження деталей для всіх бекапів...");

      // Створюємо масив промісів для паралельного завантаження
      const detailPromises = this.backups.map(async (backup, index) => {
        try {
          // Перевіряємо, чи вже є деталі
          if (!backup.details) {
            console.log(`Завантаження деталей для бекапу ${backup.id}...`);
            const response = await apiFetch(`/api/backups/${backup.id}/details`);

            if (response.ok) {
              const data = await response.json();
              // Оновлюємо бекап з деталями
              this.backups[index].details = data.details || data;
              console.log(`Деталі завантажено для бекапу ${backup.id}`);
            } else {
              console.error(
                `Помилка завантаження деталей для ${backup.id}:`,
                response.status
              );
            }
          }
        } catch (error) {
          console.error(
            `Помилка завантаження деталей для ${backup.id}:`,
            error
          );
        }
      });

      await Promise.allSettled(detailPromises);
      console.log("Автоматичне завантаження деталей завершено");
    },


    async createBackup() {
      try {
        this.isCreatingBackup = true;
        const response = await apiFetch("/api/backups", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const newBackup = await response.json();
          this.backups.unshift(newBackup);
          this.showNotification("Резервна копія створюється...", "success");
        } else {
          throw new Error("Помилка створення бекапу");
        }
      } catch (error) {
        console.error("Помилка:", error);
        this.showNotification("Помилка створення бекапу", "error");
      } finally {
        this.isCreatingBackup = false;
      }
    },

    async loadBackupDetails(backupId) {
      try {
        console.log("Завантаження деталей для бекапу:", backupId);
        const response = await apiFetch(`/api/backups/${backupId}/details`);

        if (response.ok) {
          const data = await response.json();
          console.log("Отримані деталі бекапу:", data);

          // Знаходимо індекс бекапу
          const backupIndex = this.backups.findIndex(
            (b) => b.id === backupId
          );
          if (backupIndex !== -1) {
            // У Vue 3 просто присвоюємо значення - воно буде реактивним
            this.backups[backupIndex].details = data.details || data;
            console.log(
              "Оновлені деталі бекапу:",
              this.backups[backupIndex].details
            );
          }
        } else {
          console.error(
            "Помилка відповіді сервера:",
            response.status,
            response.statusText
          );
          this.showNotification(
            `Помилка завантаження деталей: ${response.status}`,
            "error"
          );
        }
      } catch (error) {
        console.error("Помилка завантаження деталей бекапу:", error);
        this.showNotification(
          "Помилка мережі при завантаженні деталей",
          "error"
        );
      }
    },

    async restoreBackup(backupId, guildId) {
      if (
        !confirm(
          `Ви впевнені, що хочете відновити цю резервну копію на сервер ${guildId}? Ця дія перезапише поточні налаштування.`
        )
      ) {
        return;
      }

      try {
        const response = await apiFetch(
          `/api/guild/${guildId}/backups/${backupId}/restore`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              guildId: guildId, // ← Передаємо ID гільдії в тілі запиту
            }),
          }
        );

        if (response.ok) {
          this.showNotification("Відновлення розпочато...", "success");
        } else {
          throw new Error("Помилка відновлення");
        }
      } catch (error) {
        console.error("Помилка:", error);
        this.showNotification("Помилка відновлення бекапу", "error");
      }
    },

    async downloadBackup(backupId) {
      try {
        const response = await apiFetch(`/api/backups/${backupId}/download`);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `backup-${backupId}.zip`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          this.showNotification(
            "Функція завантаження тимчасово недоступна",
            "error"
          );
        }
      } catch (error) {
        console.error("Помилка:", error);
        this.showNotification("Помилка завантаження", "error");
      }
    },

    async deleteBackup(backupId) {
      if (!confirm("Ви впевнені, що хочете видалити цю резервну копію?")) {
        return;
      }

      try {
        const response = await apiFetch(`/api/backups/${backupId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          this.backups = this.backups.filter(
            (backup) => backup.id !== backupId
          );
          this.showNotification("Бекап видалено", "success");
        } else {
          throw new Error("Помилка видалення");
        }
      } catch (error) {
        console.error("Помилка:", error);
        this.showNotification("Помилка видалення бекапу", "error");
      }
    },

    shareBackup(backupId) {
      const backup = this.backups.find((b) => b.id === backupId);
      if (backup && backup.shareId) {
        navigator.clipboard.writeText(
          `${window.location.origin}/backups/share/${backup.shareId}`
        );
        this.showNotification(
          "Посилання скопійовано в буфер обміну",
          "success"
        );
      } else {
        this.showNotification("Неможливо поділитися цим бекапом", "error");
      }
    },

    getBackupIcon(type) {
      const icons = {
        full: "fas fa-database",
        settings: "fas fa-cogs",
        auto: "fas fa-robot",
        manual: "fas fa-user",
      };
      return icons[type] || "fas fa-archive";
    },

    formatDate(dateString) {
      try {
        return new Date(dateString).toLocaleString("uk-UA");
      } catch (error) {
        return "Невідома дата";
      }
    },

    showNotification(message, type = "info") {
      const existingNotifications = document.querySelectorAll(
        ".custom-notification"
      );
      existingNotifications.forEach((notification) => notification.remove());

      const notification = document.createElement("div");
      notification.className = "custom-notification";
      notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 1rem 1.5rem;
          background: ${type === "error"
          ? "#ef4444"
          : type === "success"
            ? "#22c55e"
            : "#3b82f6"
        };
          color: white;
          border-radius: 8px;
          z-index: 10000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          font-family: inherit;
        `;
      notification.textContent = message;
      document.body.appendChild(notification);

      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    },
  },
})

app.use(window.i18n);
app.mount("#app");
