const { createApp } = Vue;
// Ініціалізація toastification
const { useToast } = window.Toastification;

const app = createApp({
  data() {
    try {
      const appElement = document.getElementById("app");
      if (!appElement) throw new Error("Елемент додатку не знайдено");

      return {
        guild: JSON.parse(appElement.dataset.guild || "{}"),
        guildId: appElement.dataset.guildId || "",
        user: JSON.parse(appElement.dataset.user || "{}"),
        isLoading: true,
        error: null,
        selectedWebhook: null,
        customWebhook: "",
      };
    } catch (e) {
      console.error("Помилка ініціалізації даних:", e);
      return {
        guild: {},
        guildId: "",
        user: {},
        isLoading: false,
        error: "Помилка завантаження даних",
        selectedWebhook: null,
        customWebhook: "",
      };
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  // ... (решта вашого коду без змін)
});

// Компонент header
app.component("header-component", {
  template: `
        <header class="app-header">
            <nav class="navbar">
                <div class="navbar-brand">
                    <h1>Discord Bot Dashboard</h1>
                </div>
                <div class="navbar-user">
                    <span v-if="user">{{ user.username }}</span>
                    <img v-if="user?.avatar" 
                         :src="'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.png'" 
                         alt="User Avatar" 
                         class="user-avatar">
                </div>
            </nav>
        </header>
    `,
});

// Монтування додатку
function mountApp() {
  const appElement = document.getElementById("app");
  if (!appElement) {
    console.error("Елемент додатку не знайдено");
    return;
  }

  try {
    app.mount("#app");
    console.log("Додаток успішно монтовано");
  } catch (mountError) {
    console.error("Помилка монтування додатку:", mountError);
    appElement.innerHTML = "<h1>Сталася помилка при завантаженні додатку</h1>";
  }
}

// Зачекати повного завантаження DOM
if (document.readyState === "complete") {
  mountApp();
} else {
  window.addEventListener("DOMContentLoaded", mountApp);
}
