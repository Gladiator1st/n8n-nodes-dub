import tsParser from '@typescript-eslint/parser';
import n8nNodesBase from 'eslint-plugin-n8n-nodes-base';

export default [
	{
		files: ['nodes/**/*.ts', 'credentials/**/*.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json',
				sourceType: 'module',
			},
		},
		plugins: {
			'n8n-nodes-base': n8nNodesBase,
		},
		rules: {
			...n8nNodesBase.configs.community.rules,
		},
	},
];
