import globals from 'globals';
import pluginJs from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';


export default [
  {languageOptions: { globals: globals.browser, _: "writeble" }},
  pluginJs.configs.recommended,

  {
    plugins:{
      '@stylistic/js': stylisticJs
    }
  },
  
  {
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      '@stylistic/js/max-len': ['error', {'code': 120}]
    }
  }
];