import HeaderComponent from "./headerComponent.js";
import FooterComponent from "./footerComponent.js";

const { createApp } = Vue;

const app = createApp({
  setup() {
    const { t } = VueI18n.useI18n();
    return { t };
  }
});

app.component("header-component", HeaderComponent);
app.component("footer-component", FooterComponent);

// 🔥 КРИТИЧНО
app.use(window.i18n);

app.mount("#app");