<!-- layout/admin-side.ejs -->
<div class="flex min-h-screen">
    <aside class="w-72 bg-[#111116] border-r border-white/5 hidden md:block">
        <div class="p-8">
            <h2 class="text-2xl font-black tracking-tighter text-white flex items-center">
                <span class="text-indigo-500 mr-2">Anti</span>Link
            </h2>
            <p class="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mt-1">Management Core</p>
        </div>

        <nav class="mt-4 px-4 space-y-2">
            <a href="/admin/admin" class="nav-link">
                <i class="fas fa-th-large"></i> Огляд системи
            </a>
            <a href="/admin/guilds" class="nav-link">
                <i class="fas fa-shield-halved"></i> Сервери
            </a>
            <a href="/admin/users" class="nav-link">
                <i class="fas fa-user-shield"></i> Адміністратори
            </a>
            <a href="/admin/blacklist" class="nav-link">
                <i class="fas fa-ban"></i> Чорний список
            </a>

            <div class="pt-10 pb-4 px-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Security
            </div>

            <a href="/admin/passkeys" class="nav-link text-indigo-400 hover:text-indigo-300">
                <i class="fas fa-fingerprint"></i> Мої passkeys
            </a>
        </nav>
    </aside>