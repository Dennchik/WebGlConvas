import globals from 'globals'; // Импортируем библиотеку
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{languageOptions: {globals: globals.browser}},
	pluginJs.configs.recommended,
];