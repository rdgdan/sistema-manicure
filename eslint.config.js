import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  {
    // Ignora os diretórios de build e dependências
    ignores: ["node_modules", "dist", "build"],
  },
  {
    // Configurações de linguagem e ambiente
    languageOptions: { 
      globals: globals.browser 
    }
  },
  // Configuração recomendada do Eslint-plugin-js
  pluginJs.configs.recommended,
  {
    // Configurações específicas do React
    ...pluginReactConfig, // Usa a configuração recomendada do React
    settings: {
      react: {
        version: "detect", // Detecta automaticamente a versão do React
      },
    },
  },
];
