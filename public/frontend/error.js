
import HeaderComponent from "./headerComponent.js";
import FooterComponent from "./footerComponent.js"
function goBack() {
  window.history.back();
}

document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.querySelector(".btn-outline-light");
  if (backBtn) {
    backBtn.addEventListener("click", goBack);
  }
});

document
  .querySelectorAll(".settings-card a")
  .forEach((a) => a.setAttribute("rel", "noopener noreferrer"));

const { createApp } = Vue;

const app = createApp({

  components: {
    "header-component": HeaderComponent,
    "footer-component": FooterComponent,
  },

  setup() {

    const { t } = VueI18n.useI18n();

    return {
      t
    };
  },



})
app.use(window.i18n);
app.mount("#app");