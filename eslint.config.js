import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';

export default [
  // 1. ПАПКИ-ВИКЛЮЧЕННЯ (Заміна .eslintignore)
  {
    ignores: ['node_modules', 'dist', 'public', '.vscode'],
  },

  // 2. БАЗОВІ НАЛАШТУВАННЯ JS
  js.configs.recommended,

  // 3. НАЛАШТУВАННЯ VUE (Flat Config)
  ...pluginVue.configs['flat/recommended'],

  // 4. ТВОЇ ПРАВИЛА
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'error', // Червоне на невикористані змінні
      'no-console': 'warn', // Червоне на console.log
      semi: ['error', 'always'], // Вимагати крапку з комою (або 'never', якщо не любиш)
      'vue/multi-word-component-names': 'off', // Щоб не сварився на назви типу Home.vue
    },
  },
];
