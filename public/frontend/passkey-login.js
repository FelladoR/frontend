import { apiFetch } from "./utils/api.js";

// Правильно дістаємо функцію з об'єкта
const { startAuthentication } = window.SimpleWebAuthnBrowser;
const returnTo = window.returnTo;

const verifyBtn = document.getElementById('verifyPasskeyBtn');

async function verifyPasskey() {
    try {
        console.log("🔑 Starting passkey verification...");

        // 1. Отримуємо опції для логіну
        const optionsRes = await apiFetch('/login-options');
        const options = await optionsRes.json();

        console.log("Auth options:", options);

        // 2. Викликаємо вікно браузера (FaceID, TouchID, Windows Hello)
        const authResp = await startAuthentication(options);

        // 3. Відправляємо результат на перевірку
        // ВИПРАВЛЕНО: шлях тепер збігається з бекендом
        const verifyRes = await apiFetch('/verify-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(authResp),
        });

        const result = await verifyRes.json();

        if (result.verified) {
            console.log("✅ Успішно! Перенаправлення...");
            window.location.href = result.returnTo || returnTo || "/admin";
        } else {
            alert('❌ Помилка: ' + (result.error || 'Невідома помилка'));
        }

    } catch (err) {
        console.error('❌ Passkey error:', err);
        alert('❌ Помилка: ' + err.message);
    }
}

if (verifyBtn) {
    verifyBtn.addEventListener('click', verifyPasskey);
}