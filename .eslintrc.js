module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: [
    'align-assignments'
  ],
  extends: [
    '@nuxtjs',
    'airbnb-base',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {

    // vvv assignments (= / :) alignment vvv
    'align-assignments/align-assignments': ['error', { requiresOnly: false }],
    'no-multi-spaces': ['off'], // <<< needed for align-assignments
    'key-spacing': ['error', { align: { beforeColon: false, afterColon: true, on: 'colon', mode: 'strict' } }],
    // ^^^ assignments (= / :) alignment ^^^

    'max-len': ['error', { code: 160, comments: 100, tabWidth: 2 }], // default 100 is too short
    'array-bracket-spacing': ['error', 'always', { arraysInArrays: false, objectsInArrays: false }],
    'no-plusplus': ['off'],
    'no-console': ['off'],
    'no-use-before-define': ['error', { functions: false, classes: false }],
    'no-underscore-dangle': ['error', { allow: ['_id'] }], // <<< MongoDB Ids (_id) fix

    // vvv airbnb-base overrides fix vvv
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      vue: 'never'
    }]
    // ^^^ airbnb-base overrides fix ^^^
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@roles', './configs/roles.js']
        ]
      },
      nuxt: { } // <<< airbnb-base overrides fix
    },
    'import/core-modules': [
      'vue',
      'vuex'
    ]
  }
};
