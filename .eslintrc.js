module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:vue/vue3-recommended',
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'vue',
    ],
    rules: {
        'no-param-reassign': 0,
        'global-require': 0,
        'import/prefer-default-export': 0,
        'import/extensions': 0,
        'import/no-unresolved': 0,
        'max-len': 0,
        'import/no-cycle': 0,
        'no-nested-ternary': 0,
        indent: ['error', 4],
        'vue/no-multiple-template-root': 0,
        'vue/multi-word-component-names': 0,
        'prefer-promise-reject-errors': 0,
        'no-unused-vars': 0,
        'vue/no-v-model-argument': 0,
        'import/no-absolute-path': 0,
        'object-curly-newline': 0,
        'prefer-destructuring': 0,
        'no-restricted-globals': 0,
        'consistent-return': 0,
        radix: 0,
        'no-plusplus': 0,
        'vue/no-mutating-props': 0,
        'no-loop-func': 0,
        'class-methods-use-this': 0,
        'no-shadow': 0,
        'no-mixed-operators': 0,
        'import/no-extraneous-dependencies': 0,
        'vue/html-indent': ['error', 4, {
            attribute: 1,
            baseIndent: 1,
            closeBracket: 0,
            alignAttributesVertically: true,
            ignores: [],
        }],
        'import/first': 0,
        'vue/require-default-prop': 0,
        'vue/no-setup-props-destructure': 0,
        'vue/html-closing-bracket-newline': 0,
        'vue/singleline-html-element-content-newline': 0,
        'vue/max-attributes-per-line': ['error', {
            singleline: {
                max: 4,
            },
            multiline: {
                max: 4,
            },
        }],
        'linebreak-style': 0,
    },
};