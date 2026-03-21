// frontend/admin-list.js
import { apiFetch } from "./utils/api.js";
const { createApp } = Vue;

// Отримуємо дані з data-атрибутів
const dataElement = document.getElementById('app-data');
const initialData = {
    user: JSON.parse(dataElement?.dataset.user || '{}'),
    admins: JSON.parse(dataElement?.dataset.admins || '[]'),
    stats: JSON.parse(dataElement?.dataset.stats || '{}'),
    currentUserRole: dataElement?.dataset.currentRole || 'viewer'
};

const app = createApp({
    data() {
        return {
            user: initialData.user,
            admins: initialData.admins,
            stats: initialData.stats,
            currentUserRole: initialData.currentUserRole,
            showModal: false,
            filter: 'all',
            newAdmin: {
                userId: '',
                username: '',
                role: 'viewer'
            },
            errors: {},
            loading: false,
            filterOptions: [
                { value: 'all', label: 'Всі' },
                { value: 'superadmin', label: 'Superadmin' },
                { value: 'admin', label: 'Admin' },
                { value: 'moderator', label: 'Moderator' },
                { value: 'viewer', label: 'Viewer' },
                { value: 'hasPasskey', label: 'З passkey' },
                { value: 'noPasskey', label: 'Без passkey' }
            ]
        };
    },

    computed: {
        filteredAdmins() {
            let filtered = [...this.admins];
            
            if (this.filter === 'superadmin') {
                filtered = filtered.filter(a => a.role === 'superadmin');
            } else if (this.filter === 'admin') {
                filtered = filtered.filter(a => a.role === 'admin');
            } else if (this.filter === 'moderator') {
                filtered = filtered.filter(a => a.role === 'moderator');
            } else if (this.filter === 'viewer') {
                filtered = filtered.filter(a => a.role === 'viewer');
            } else if (this.filter === 'hasPasskey') {
                filtered = filtered.filter(a => a.hasPasskey);
            } else if (this.filter === 'noPasskey') {
                filtered = filtered.filter(a => !a.hasPasskey);
            }
            
            return filtered;
        }
    },

    methods: {
        setFilter(filter) {
            this.filter = filter;
        },

        openAddAdminModal() {
            this.showModal = true;
            this.errors = {};
            this.newAdmin = { userId: '', username: '', role: 'viewer' };
        },

        closeAddAdminModal() {
            this.showModal = false;
        },

        validateForm() {
            this.errors = {};

            if (!this.newAdmin.userId || this.newAdmin.userId.length < 10) {
                this.errors.userId = "Введіть коректний Discord ID";
            }

            if (!this.newAdmin.username || this.newAdmin.username.length < 2) {
                this.errors.username = "Ім'я користувача занадто коротке";
            }

            return Object.keys(this.errors).length === 0;
        },

        async addAdmin() {
            if (!this.validateForm()) {
                return;
            }

            this.loading = true;

            try {
                const csrfRes = await fetch('/api/csrf');
                const csrfData = await csrfRes.json();

                const res = await fetch('/admin/users', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfData.csrfToken
                    },
                    body: JSON.stringify(this.newAdmin)
                });

                const result = await res.json();

                if (res.ok) {
                    alert('✅ Адміністратора додано');
                    this.showModal = false;
                    this.newAdmin = { userId: '', username: '', role: 'viewer' };
                    await this.loadAdmins();
                } else {
                    alert('❌ Помилка: ' + result.error);
                }
            } catch (err) {
                console.error('Add admin error:', err);
                alert('❌ Помилка: ' + err.message);
            } finally {
                this.loading = false;
            }
        },

        async loadAdmins() {
            try {
                const res = await apiFetch('/admin/users');
                const data = await res.json();
                this.admins = data.admins || [];
                this.stats = data.stats || {
                    totalAdmins: this.admins.length,
                    superadmins: this.admins.filter(a => a.role === 'superadmin').length,
                    passkeyUsers: this.admins.filter(a => a.hasPasskey).length
                };
            } catch (err) {
                console.error('Error loading admins:', err);
            }
        },

        async deleteAdmin(userId) {
            if (!confirm('Ви впевнені, що хочете видалити цього адміністратора?')) return;

            try {
                const csrfRes = await fetch('/api/csrf');
                const csrfData = await csrfRes.json();

                const res = await fetch(`/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-Token': csrfData.csrfToken
                    }
                });

                if (res.ok) {
                    alert('✅ Адміністратора видалено');
                    await this.loadAdmins();
                } else {
                    const error = await res.json();
                    alert('❌ Помилка: ' + error.error);
                }
            } catch (err) {
                alert('❌ Помилка: ' + err.message);
            }
        },

        editAdmin(userId) {
            alert('Функція редагування для ' + userId);
        },

        async sendPasskeyInvite(userId) {
            try {
                const csrfRes = await fetch('/api/csrf');
                const csrfData = await csrfRes.json();

                const res = await fetch(`/admin/users/${userId}/invite-passkey`, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-Token': csrfData.csrfToken
                    }
                });

                if (res.ok) {
                    alert('✅ Запрошення надіслано');
                } else {
                    const error = await res.json();
                    alert('❌ Помилка: ' + error.error);
                }
            } catch (err) {
                alert('❌ Помилка: ' + err.message);
            }
        }
    }
});

app.config.globalProperties.$api = apiFetch;
app.mount("#app");