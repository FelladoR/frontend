// composables/guild-settings/useCooldown.js
import { ref } from 'vue';

export function useCooldown(initialSeconds = 5) {
  const isCooldown = ref(false);
  const cooldownRemaining = ref(0);
  let timer = null;

  const startCooldown = (seconds = initialSeconds) => {
    console.log('Запуск кулдауну на', seconds, 'секунд');

    if (timer) clearInterval(timer);

    isCooldown.value = true;
    cooldownRemaining.value = seconds;

    timer = setInterval(() => {
      if (cooldownRemaining.value > 0) {
        cooldownRemaining.value--;
        console.log('Кулдаун:', cooldownRemaining.value);
      }

      if (cooldownRemaining.value <= 0) {
        clearInterval(timer);
        isCooldown.value = false;
        timer = null;
        console.log('Кулдаун завершено');
      }
    }, 1000);
  };

  const setRemainingTime = (seconds) => {
    console.log('Встановлення залишку часу:', seconds);
    if (seconds > 0) {
      if (timer) clearInterval(timer);
      isCooldown.value = true;
      cooldownRemaining.value = seconds;

      timer = setInterval(() => {
        if (cooldownRemaining.value > 0) {
          cooldownRemaining.value--;
        }
        if (cooldownRemaining.value <= 0) {
          clearInterval(timer);
          isCooldown.value = false;
          timer = null;
        }
      }, 1000);
    }
  };

  const resetCooldown = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    isCooldown.value = false;
    cooldownRemaining.value = 0;
  };

  return {
    isCooldown,
    cooldownRemaining,
    startCooldown,
    setRemainingTime,
    resetCooldown,
  };
}
