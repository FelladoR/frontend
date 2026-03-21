import { apiFetch } from "./utils/api.js";
const { createApp } = Vue;
import HeaderComponent from "./headerComponent.js";
import FooterComponent from "./footerComponent.js";

const app = createApp({
  components: {
    "header-component": HeaderComponent,
    "footer-component": FooterComponent,
  },

  setup() {
    const { t } = VueI18n.useI18n();

    return {
      t
    }
  },

  data() {
    return {

      
      user: null,
      captchaPassed: false,
      captchaToken: "",
      form: {
        warnDate: "",
        reason: "",
        issuer: "",
        understood: "",
      },
      errors: {},
    };
  },

  computed: {
    user_id() {
      return this.user?.id || "";
    },
  },
  async mounted() {
    const res = await apiFetch("api/user");
    this.user = await res.json();
  
  },
  methods: {
    onCaptchaSuccess(token) {
      this.captchaPassed = true;
      this.captchaToken = token;
    },
    validateForm() {
      this.errors = {}; // очищення попередніх помилок

      if (!this.form.warnDate) {
        this.errors.warnDate = "Вкажіть дату.";
      }

      if (!this.form.reason || this.form.reason.length < 10) {
        this.errors.reason = "Опишіть причину (мінімум 10 символів).";
      } else if (this.form.reason.length > 500) {
        this.errors.reason = "Максимум 500 символів.";
      }

      if (!this.form.issuer || this.form.issuer.length < 3) {
        this.errors.issuer = "Вкажіть, хто видав (мінімум 3 символи).";
      }

      if (!this.form.understood || this.form.understood.length < 10) {
        this.errors.understood =
          "Напишіть, як ви зрозуміли помилку (мінімум 10 символів).";
      }

      return Object.keys(this.errors).length === 0;
    },
    async submitForm() {
      if (!this.captchaPassed) {
        alert("Будь ласка, підтвердіть капчу.");
        return;
      }

      if (!this.validateForm()) {
        return;
      }

      try {
        const response = await apiFetch("/api/application", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...this.form,
            user_id: this.user_id,
            captchaToken: this.captchaToken,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Помилка:", errorData);
          alert("Помилка при надсиланні форми.");
          return;
        }

        const result = await response.json();
        alert("Форма надіслана успішно!");
        setTimeout(() => {
          window.history.back();
        }, 1000);

        this.form = {
          warnDate: "",
          reason: "",
          issuer: "",
          understood: "",
        };
        this.captchaPassed = false;
        turnstile.reset("#cf-turnstile");
      } catch (err) {
        console.error("Запит не вдався:", err);
        alert("Сталася помилка.");
      }
    },
  },
});

app.config.globalProperties.$api = apiFetch;
app.use(window.i18n)
const vm = app.mount("#app");

window.onCaptchaSuccess = function (token) {
  vm.onCaptchaSuccess(token); 
};
