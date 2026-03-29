import { ref } from 'vue';
import { apiFetch } from '@/api';

// Передаємо guildId та функції кулдауну
export function useBackups(guildId, { isCooldown, cooldownMessage }) {
  const backups = ref({ list: [], loading: false, creating: false });
  const hasAdminPermissions = ref(false);

  async function loadBackups() {
    backups.value.loading = true;
    try {
      const res = await apiFetch(`/api/guild/${guildId}/backups`);
      if (!res.ok) throw new Error('Помилка завантаження бекапів');

      const result = await res.json();
      hasAdminPermissions.value = result.hasAdminPerms === true;
      const backupsData = Array.isArray(result) ? result : result.data || [];

      backups.value.list = backupsData.map((b) => ({
        id: b.backupId,
        backupId: b.backupId,
        name:
          b.name || `Бекап від ${new Date(b.createdAt).toLocaleDateString()}`,
        createdAt: b.createdAt,
        size: b.size || 0,
        status: 'completed',
      }));
    } catch (err) {
      console.error(err);
    } finally {
      backups.value.loading = false;
    }
  }

  async function createBackup(onSuccess, onError) {
    if (isCooldown.value) return onError(cooldownMessage.value);

    backups.value.creating = true;
    try {
      const res = await apiFetch(`/api/guild/${guildId}/create_backup`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Помилка сервера');

      const newBackup = await res.json();
      const bData = newBackup.result || newBackup.data || newBackup;

      backups.value.list.unshift({
        id: bData.backupId || bData.id,
        backupId: bData.backupId || bData.id,
        name: bData.name || `Бекап від ${new Date().toLocaleDateString()}`,
        createdAt: bData.createdAt || new Date().toISOString(),
        size: bData.size || 0,
        status: 'completed',
      });
      onSuccess('Резервну копію успішно створено!');
    } catch (err) {
      onError(err.message);
    } finally {
      backups.value.creating = false;
    }
  }

  // Функції confirmCreateBackup, restoreBackup, deleteBackup можна додати сюди ж за аналогією

  return { backups, hasAdminPermissions, loadBackups, createBackup };
}
