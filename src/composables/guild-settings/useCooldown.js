import { ref, onBeforeUnmount } from 'vue';
import { apiFetch } from '@/api';

export function useCooldown() {
  const isCooldown = ref(false);
  const cooldownRemaining = ref(0);
  const cooldownMessage = ref(null);
  let timer = null;

  function startCooldownTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      cooldownRemaining.value--;
      if (cooldownRemaining.value <= 0) {
        clearInterval(timer);
        isCooldown.value = false;
        cooldownMessage.value = null;
      } else {
        cooldownMessage.value = `Зачекайте ${cooldownRemaining.value} секунд`;
      }
    }, 1000);
  }

  async function checkCooldown() {
    try {
      const response = await apiFetch('/guild/cooldown', {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.hasCooldown && data.remaining > 0) {
        cooldownRemaining.value = Math.max(0, data.remaining);
        isCooldown.value = true;
        startCooldownTimer();
        return true;
      }
      isCooldown.value = false;
      return false;
    } catch (err) {
      console.error('Помилка перевірки cooldown:', err);
      return false;
    }
  }

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer);
  });

  return { isCooldown, cooldownRemaining, cooldownMessage, checkCooldown };
}
