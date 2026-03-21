// frontend/admin.js
import { apiFetch } from "./utils/api.js";

console.log("🔥 admin.js завантажився!");

const { startRegistration } = SimpleWebAuthnBrowser;

// Функція реєстрації
async function registerPasskey() {
    console.log("Початок реєстрації Passkey...");

    try {
        const optionsRes = await apiFetch('/register-options');
        if (!optionsRes.ok) throw new Error('Не вдалося отримати опції');

        const options = await optionsRes.json();
        console.log("Опції отримано:", options);

        const regResp = await startRegistration(options);
        console.log("Відповідь від автентифікатора:", regResp);

        const verifyRes = await apiFetch('/admin/verify-registration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regResp),
        });

        const result = await verifyRes.json();

        if (result.verified) {
            alert('✅ Passkey успішно додано!');
            window.location.reload();
        } else {
            alert('❌ Помилка: ' + result.error);
        }

    } catch (err) {
        console.error("Помилка:", err);
        alert('Помилка: ' + err.message);
    }
}

// Додаємо обробник події після завантаження DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM завантажено");
    
    // Шукаємо кнопку за ID
    const registerBtn = document.getElementById('registerPasskeyBtn');
    
    if (registerBtn) {
        console.log("✅ Кнопку знайдено, додаємо обробник");
        registerBtn.addEventListener('click', registerPasskey);
        registerBtn.removeAttribute('onclick');
    } else {
        console.log("ℹ️ Кнопка registerPasskeyBtn не знайдена на цій сторінці");
    }
});