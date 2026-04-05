// composables/guild-settings/useBackups.js
import { ref } from 'vue';
import { apiFetch } from '@/api';

export function useBackups(guildId, options = {}) {
  const backups = ref({
    list: [],
    loading: false,
    creating: false,
  });

  const hasAdminPermissions = ref(true);

  const loadBackups = async () => {
    console.log('Завантаження бекапів для гільдії:', guildId);
    backups.value.loading = true;

    try {
      const response = await apiFetch(`/api/guild/${guildId}/backups`);
      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Отримані дані бекапів:', data);

        if (data.data && Array.isArray(data.data)) {
          // Трансформуємо дані, щоб скрізь був доступний backupId
          backups.value.list = data.data.map((backup) => ({
            ...backup,
            backupId: backup.backupId || backup._id, // гарантуємо наявність backupId
            displayId: backup.backupId || backup._id, // для відображення
          }));
          hasAdminPermissions.value = data.hasAdminPerms || true;
          console.log('Завантажено бекапів:', backups.value.list.length);
          console.log('Перший бекап:', backups.value.list[0]);
        } else if (data.backups && Array.isArray(data.backups)) {
          backups.value.list = data.backups.map((backup) => ({
            ...backup,
            backupId: backup.backupId || backup.id || backup._id,
            displayId: backup.backupId || backup.id || backup._id,
          }));
        } else if (Array.isArray(data)) {
          backups.value.list = data.map((backup) => ({
            ...backup,
            backupId: backup.backupId || backup._id,
            displayId: backup.backupId || backup._id,
          }));
        } else {
          console.warn('Невідома структура відповіді:', data);
          backups.value.list = [];
        }
      } else {
        const errorText = await response.text();
        console.error('Помилка завантаження:', errorText);
        backups.value.list = [];
      }
    } catch (error) {
      console.error('Помилка завантаження бекапів:', error);
      backups.value.list = [];
    } finally {
      backups.value.loading = false;
    }
  };

  const createBackup = async (showSuccess, showError) => {
    // Перевірка кулдауну - важливо: options.isCooldown це ref
    if (options.isCooldown?.value) {
      showError?.('Зачекайте перед створенням нового бекапу');
      return;
    }

    backups.value.creating = true;
    try {
      const response = await apiFetch(`/api/guild/${guildId}/create_backup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Створення бекапу, статус:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Бекап створено:', data);
        showSuccess?.('Бекап успішно створено!');

        // Запускаємо кулдаун після успішного створення
        if (options.startCooldown) {
          options.startCooldown(30);
        }

        await loadBackups();
      } else if (response.status === 300) {
        const error = await response.json();
        showError?.(error.error || 'Максимум 2 резервні копії на гільдію');
      } else {
        const error = await response
          .json()
          .catch(() => ({ message: 'Невідома помилка' }));
        throw new Error(
          error.message || error.error || 'Помилка створення бекапу'
        );
      }
    } catch (error) {
      console.error('Помилка створення:', error);
      showError?.(error.message);
    } finally {
      backups.value.creating = false;
    }
  };

  return {
    backups,
    hasAdminPermissions,
    loadBackups,
    createBackup,
  };
}
