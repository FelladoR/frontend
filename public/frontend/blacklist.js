import { apiFetch } from "./utils/api.js";
const { createApp } = Vue;

const dataElement = document.getElementById('app-data');
const initialData = {
    user: JSON.parse(dataElement?.dataset.user || '{}'),
    users: JSON.parse(dataElement?.dataset.users || '[]'),
    currentUserRole: dataElement?.dataset.currentRole || 'viewer'
};

const app = createApp({
    data() {
        return {
            user: initialData.user,
            users: initialData.users,
            currentUserRole: initialData.currentUserRole,
            searchQuery: '',
            currentFilter: 'all',
            currentPage: 1,
            itemsPerPage: 10,
            showWarnModal: false,
            warnLoading: false,
            warnForm: {
                userId: '',
                reason: '',
                proofs: ''
            },
            filterOptions: [
                { value: 'all', label: 'Всі' },
                { value: 'warning', label: 'Є попередження' },
                { value: 'noWarning', label: 'Без попереджень' },
                { value: 'high', label: '≥3 попередження' }
            ]
        };
    },

    computed: {
        filteredUsers() {
            let filtered = [...this.users];

            // Фільтр за пошуком
            if (this.searchQuery) {
                filtered = filtered.filter(u => u._id.includes(this.searchQuery));
            }

            // Фільтр за типом
            if (this.currentFilter === 'warning') {
                filtered = filtered.filter(u => u.warns > 0);
            } else if (this.currentFilter === 'noWarning') {
                filtered = filtered.filter(u => u.warns === 0);
            } else if (this.currentFilter === 'high') {
                filtered = filtered.filter(u => u.warns >= 3);
            }

            return filtered;
        },

        totalPages() {
            return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
        },

        paginatedUsers() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredUsers.slice(start, end);
        },

        paginationStart() {
            return this.filteredUsers.length === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
        },

        paginationEnd() {
            return Math.min(this.currentPage * this.itemsPerPage, this.filteredUsers.length);
        },

        displayedPages() {
            const total = this.totalPages;
            const current = this.currentPage;
            const pages = [];

            if (total <= 5) {
                for (let i = 1; i <= total; i++) pages.push(i);
            } else {
                if (current <= 3) {
                    for (let i = 1; i <= 4; i++) pages.push(i);
                    pages.push('...');
                    pages.push(total);
                } else if (current >= total - 2) {
                    pages.push(1);
                    pages.push('...');
                    for (let i = total - 3; i <= total; i++) pages.push(i);
                } else {
                    pages.push(1);
                    pages.push('...');
                    for (let i = current - 1; i <= current + 1; i++) pages.push(i);
                    pages.push('...');
                    pages.push(total);
                }
            }
            return pages;
        },

        totalWarnings() {
            return this.users.reduce((sum, u) => sum + (u.warns || 0), 0);
        },

        avgWarnings() {
            return this.users.length ? (this.totalWarnings / this.users.length).toFixed(1) : 0;
        },

        todayWarnings() {
            const today = new Date().toISOString().slice(0, 10);
            return this.users.reduce((sum, u) => {
                return sum + (u.reasons?.filter(r => r.timestamp?.startsWith(today)).length || 0);
            }, 0);
        }
    },

    methods: {
        formatDate(dateStr) {
            if (!dateStr) return 'Немає';
            return new Date(dateStr).toLocaleString('uk-UA');
        },

        getLastWarning(user) {
            if (!user.reasons || user.reasons.length === 0) return null;
            return user.reasons[user.reasons.length - 1];
        },

        getFilterCount(filter) {
            if (filter === 'all') return this.users.length;
            if (filter === 'warning') return this.users.filter(u => u.warns > 0).length;
            if (filter === 'noWarning') return this.users.filter(u => u.warns === 0).length;
            if (filter === 'high') return this.users.filter(u => u.warns >= 3).length;
            return 0;
        },

        setFilter(filter) {
            this.currentFilter = filter;
            this.currentPage = 1;
        },

        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },

        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },

        goToPage(page) {
            if (page === '...') return;
            this.currentPage = page;
        },

        openWarnModal() {
            this.showWarnModal = true;
            this.warnForm = { userId: '', reason: '', proofs: '' };
        },

        closeWarnModal() {
            this.showWarnModal = false;
        },

        async submitWarn() {
            this.warnLoading = true;
            try {

                const res = await apiFetch('/admin/blacklist/warn', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.warnForm)
                });

                if (res.ok) {
                    alert('✅ Попередження видано');
                    this.closeWarnModal();
                    window.location.reload();
                } else {
                    const error = await res.json();
                    alert('❌ Помилка: ' + error.error);
                }
            } catch (err) {
                alert('❌ Помилка: ' + err.message);
            } finally {
                this.warnLoading = false;
            }
        },

        viewUserHistory(user) {
            const history = user.reasons?.map(r =>
                `📅 ${this.formatDate(r.timestamp)}\n👤 Видав: ${r.author_id}\n📝 Причина: ${r.reason}${r.proofs ? `\n🔗 Докази: ${r.proofs}` : ''}`
            ).join('\n\n') || 'Немає попереджень';
            alert(`📋 Історія користувача ${user._id}:\n\n${history}`);
        },

        async removeWarning(user) {
            if (!confirm(`Зняти останнє попередження з користувача ${user._id}?`)) return;

            try {

                const res = await apiFetch(`/admin/blacklist/${user._id}/remove-warning`, {
                    method: 'POST',

                });

                if (res.ok) {
                    alert('✅ Попередження знято');
                    window.location.reload();
                } else {
                    const error = await res.json();
                    alert('❌ Помилка: ' + error.error);
                }
            } catch (err) {
                alert('❌ Помилка: ' + err.message);
            }
        },

    }
});

app.mount("#app");