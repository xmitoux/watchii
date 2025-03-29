import perfectionist from 'eslint-plugin-perfectionist'
import onlyWarn from 'eslint-plugin-only-warn';
import typescriptParser from '@typescript-eslint/parser';
import stylistic from '@stylistic/eslint-plugin';

/**
 * @type {import('eslint').Linter.FlatConfig}
 */
export const customEslintRules = {
  files: ["**/*.ts", "**/*.tsx", "**/*.mjs"],
  rules: {
    'array-callback-return': ['error', { checkForEach: true }],
    'curly': 'error',
    'import/order': 'off',
    'object-shorthand': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
  },
};

export const customIgnores = {
  ignores: [
    '**/node_modules',
    '**/public',
    '**/vendor',
    '**/dist'
  ],
};

/**
 * @type {import('eslint').Linter.FlatConfig}
 */
const configPerfectionist = {
  files: ["**/*.ts", "**/*.tsx", "**/*.mjs"],
  plugins: {
    perfectionist,
  },
  rules: {
    'perfectionist/sort-exports': 'error',
    'perfectionist/sort-imports': ['error', {
      type: 'natural',
      customGroups: {
        value: { repo: '^@repo/.*' }
      },
      groups: [
        'builtin',
        'external',
        'repo',
        'internal',
        'parent',
        'sibling',
        'side-effect',
        'side-effect-style',
        'index',
        'object',
        'style',
        'type',
        'builtin-type',
        'external-type',
        'internal-type',
        'parent-type',
        'sibling-type',
        'index-type',
        'unknown',
      ],
      newlinesBetween: 'always',
      internalPattern: [
        '^@/.*',
        '^~/.*',
      ],
    }],
    'perfectionist/sort-named-imports': ['error', { type: 'natural' }],
    'perfectionist/sort-named-exports': ['error', { type: 'natural' }],
    'perfectionist/sort-jsx-props': [
      'off',
      {
        type: 'alphabetical',
        order: 'asc',
        ignoreCase: true,
        specialCharacters: 'keep',
        ignorePattern: [],
        groups: [
          'key',
          'className',
          'style',
          'unknown',
          'callback',
        ],
        customGroups: {
          callback: '^on.+',
          key: '^key$',
          className: '^className$',
          style: '^style$',
        }
      },
    ],
  },
};

const configOnlyWarn = {
  files: ["**/*.ts", "**/*.tsx", "**/*.mjs"],
  plugins: {
    onlyWarn,
  },
};

const configStylistic = stylistic.configs.customize({
  semi: true,
});

/**
 * @type {import('eslint').Linter.FlatConfig}
 */
const customStylisticRules = {
  files: ["**/*.ts", "**/*.tsx", "**/*.mjs"],
  rules: {
    '@stylistic/array-bracket-newline': ['error', 'consistent'],
    '@stylistic/array-element-newline': ['error', 'consistent'],
    '@stylistic/function-call-argument-newline': ['error', 'consistent'],
    '@stylistic/function-call-spacing': ['error', 'never'],
    '@stylistic/function-paren-newline': ['error', 'consistent'],
    '@stylistic/indent': 'error',
    '@stylistic/no-extra-semi': 'error',
    '@stylistic/no-mixed-operators': 'error',
    '@stylistic/nonblock-statement-body-position': ['error', 'below'],
    '@stylistic/object-curly-newline': ['error', { consistent: true }],
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/semi-style': ['error', 'last'],
    '@stylistic/switch-colon-spacing': 'error',
    '@stylistic/brace-style': ['error', "stroustrup", { "allowSingleLine": false }],
    '@stylistic/arrow-parens': ['error', 'always'],
    '@stylistic/indent': ["error", 2, { "ignoredNodes": ["ConditionalExpression"] }]
  }
}

export const eslintConfigForNext = [
  customEslintRules,
  customIgnores,
  configPerfectionist,
  configOnlyWarn,
  configStylistic,
  customStylisticRules,
];

/**
 * @type {import('eslint').Linter.FlatConfig}
 * @description NestJS用のクラスデコレータに関する設定
 * @see https://typescript-eslint.io/blog/changes-to-consistent-type-imports-with-decorators/
 */
const configParser = {
  files: ["**/*.ts", "**/*.tsx", "**/*.mjs"],
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
    },
  },
};

export const eslintConfigCustom = [
  ...eslintConfigForNext,
  configParser,
];
