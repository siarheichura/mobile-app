const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const importPlugin = require('eslint-plugin-import');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    plugins: {
      import: importPlugin,
    },
    processor: angular.processInlineTemplates,
    rules: {
      // **** Angular component rules **** //

      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'nap',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'nap',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/use-component-view-encapsulation': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': ['error'],

      // **** Typescript rules **** //

      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          overrides: {
            constructors: 'no-public',
          },
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'memberLike',
          format: ['camelCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'memberLike',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        {
          selector: 'enumMember',
          format: ['PascalCase'],
        },
      ],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'signature',
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            'public-decorated-field',
            'protected-decorated-field',
            'private-decorated-field',
            'private-instance-field',
            'public-instance-field',
            'protected-instance-field',
            'constructor',
            'public-instance-method',
            'protected-instance-method',
            'private-instance-method',
          ],
        },
      ],
      '@typescript-eslint/no-inferrable-types': 'off',

      // **** Import rules **** //

      'import/order': [
        'error',
        {
          pathGroupsExcludedImportTypes: [],
          pathGroups: [
            {
              pattern: '@angular/**',
              group: 'builtin',
              position: 'after',
            },
            {
              pattern: '@{environments,core,libs}/**',
              group: 'internal',
            },
          ],
          groups: ['builtin', 'external', ['internal', 'parent', 'sibling', 'index']],
        },
      ],

      // **** Other rules **** //

      quotes: ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      'no-multiple-empty-lines': 'error',
      'newline-before-return': 'error',
      'no-multi-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
      'eol-last': ['error', 'always'],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],

    // **** Angular template rules **** //

    rules: {
      '@angular-eslint/template/no-distracting-elements': 'error',
      '@angular-eslint/template/no-duplicate-attributes': 'error',
      '@angular-eslint/template/use-track-by-function': 'error',
      '@angular-eslint/template/eqeqeq': ['error'],
      '@angular-eslint/template/no-negated-async': ['error'],
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-ngsrc': 'error',
      '@angular-eslint/template/conditional-complexity': [
        'error',
        {
          maxComplexity: 5,
        },
      ],
      '@angular-eslint/template/attributes-order': ['error'],
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
    },
  },
  {
    files: ['**/index.*.html', '**/index.html'],
    rules: {
      '@angular-eslint/template/prefer-self-closing-tags': 'off',
    },
  },
);
