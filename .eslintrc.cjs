module.exports = {
    parser: 'vue-eslint-parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        parser: '@typescript-eslint/parser',
    },
    extends: [
        'prettier',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-recommended',
        'plugin:prettier/recommended',
    ],
    env: {
        node: true,
        jest: true,
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 'warn',

        // Ignore unused vars with underscore
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
};
