// @ts-check
import simpleImportSort from 'eslint-plugin-simple-import-sort'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    // Import sorting
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // Vue-specific adjustments
    'vue/multi-word-component-names': 'off',
  },
})
