// frontend/admin.js
import { apiFetch } from "./utils/api.js";

const { startRegistration } = SimpleWebAuthnBrowser;
let isRegistering = false;

// ========== РЕЄСТРАЦІЯ PASSKEY ==========
async function registerPasskey() {
    if (isRegistering) return;
    isRegistering = true;

    try {
        console.log("📝 Початок реєстрації Passkey...");
        
        
        const optionsRes = await apiFetch('/register-options', {

        });
        
        if (!optionsRes.ok) {
            const errorText = await optionsRes.text();
            throw new Error(`HTTP ${optionsRes.status}: ${errorText}`);
        }

        const options = await optionsRes.json();
        console.log("✅ Опції отримано");

        // 3. Викликаємо startRegistration
        const regResp = await startRegistration(options);
        console.log("✅ Відповідь від автентифікатора");

        // 4. Відправляємо на верифікацію
        const verifyRes = await apiFetch('/admin/verify-registration', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(regResp)
        });

        const result = await verifyRes.json();

        if (result.verified) {
            alert('✅ Passkey успішно додано!');
            window.location.reload();
        } else {
            alert('❌ Помилка: ' + result.error);
        }
    } catch (err) {
        console.error("❌ Помилка:", err);
        alert('❌ Помилка: ' + err.message);
    } finally {
        isRegistering = false;
    }
}

// ========== ВИДАЛЕННЯ PASSKEY ==========
async function deletePasskey(credentialId) {
    if (!confirm('Ви впевнені, що хочете видалити цей passkey?')) return;

    try {

        const res = await apiFetch(`/admin/passkeys/${credentialId}`, {
            method: 'DELETE',

        });

        if (res.ok) {
            alert('✅ Passkey видалено');
            window.location.reload();
        } else {
            const error = await res.json();
            alert('❌ Помилка: ' + error.error);
        }
    } catch (err) {
        alert('❌ Помилка: ' + err.message);
    }
}

// ========== ПЕРЕЙМЕНУВАННЯ ==========
function editPasskeyName(id, currentName) {
    document.getElementById('renameKeyId').value = id;
    document.getElementById('renameKeyName').value = currentName;
    document.getElementById('renameModal').classList.remove('hidden');
}

function closeRenameModal() {
    document.getElementById('renameModal').classList.add('hidden');
}

async function renamePasskeySubmit(event) {
    event.preventDefault();
    const keyId = document.getElementById('renameKeyId').value;
    const name = document.getElementById('renameKeyName').value;

    try {
    
        const res = await apiFetch(`/admin/passkeys/${keyId}`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name })
        });

        if (res.ok) {
            alert('✅ Назву оновлено');
            window.location.reload();
        } else {
            const error = await res.json();
            alert('❌ Помилка: ' + error.error);
        }
    } catch (err) {
        alert('❌ Помилка: ' + err.message);
    }
}

// ========== КОПІЮВАННЯ ID ==========
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ ID скопійовано');
    }).catch(() => {
        alert('❌ Не вдалося скопіювати');
    });
}

// // ========== ВИМОГА PASSKEY ==========
// async function togglePasskeyRequirement() {
//     const current = document.getElementById('passkey-data')?.dataset.required === 'true';
    
//     try {

//         const res = await apiFetch('/admin/passkey-requirement', {
//             method: 'PATCH',
//             headers: { 
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ required: !current })
//         });

//         if (res.ok) {
//             window.location.reload();
//         } else {
//             const error = await res.json();
//             alert('❌ Помилка: ' + error.error);
//         }
//     } catch (err) {
//         alert('❌ Помилка: ' + err.message);
//     }
// }

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ admin.js ініціалізовано");
    
    // Додаємо обробник для кнопки реєстрації
    const registerBtn = document.getElementById('registerPasskeyBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', registerPasskey);
        console.log("✅ Обробник реєстрації додано");
    }
});

// Робимо функції глобальними для HTML викликів
window.registerPasskey = registerPasskey;
window.deletePasskey = deletePasskey;
window.editPasskeyName = editPasskeyName;
window.closeRenameModal = closeRenameModal;
window.renamePasskeySubmit = renamePasskeySubmit;
window.copyToClipboard = copyToClipboard;
window.togglePasskeyRequirement = togglePasskeyRequirement;