# Blueprint do Projeto: By Borges - Nail Design

## Visão Geral

Este documento serve como a fonte central de verdade para a arquitetura, design e funcionalidades da aplicação "By Borges". É um sistema de gerenciamento de clientes e agendamentos construído em React, projetado para ser intuitivo, responsivo e visualmente atraente.

---

## Arquitetura e Estrutura do Projeto

A aplicação segue uma arquitetura moderna baseada em componentes, com um gerenciamento de estado centralizado através de Contextos do React.

*   **`src/main.jsx`**: Ponto de entrada da aplicação. É responsável por:
    *   Renderizar a aplicação no DOM.
    *   Configurar os provedores de contexto globais na ordem correta para garantir que todos os componentes tenham acesso ao estado necessário.

*   **`src/App.jsx`**: O componente raiz da aplicação, onde as rotas principais são definidas usando `react-router-dom`.

*   **Contextos Globais**:
    *   **`src/context/auth.jsx`**: Gerencia o estado de autenticação do usuário. 
        *   **Estado:** `user`, `token`.
        *   **Ações:** `login`, `logout`.
        *   **Hook:** `useAuth()`.
        *   **Persistência:** O estado do usuário é persistido no `localStorage` para manter a sessão ativa.
    *   **`src/contexts/ThemeContext.jsx`**: Gerencia o tema da interface (claro/escuro).
        *   **Estado:** `theme` ('light' ou 'dark').
        *   **Ação:** `toggleTheme`.
        *   **Hook:** `useTheme()`.
        *   **Persistência:** A preferência de tema é persistida no `localStorage`.
    *   **`src/context/sidebarContext.jsx`**: Gerencia o estado da barra de navegação lateral.
        *   **Estado:** `isCollapsed` (recolhida/expandida).
        *   **Ação:** `toggleSidebar`.
        *   **Hook:** `useSidebar()`.

*   **Componentes Principais**:
    *   **`src/components/Sidebar.jsx`**: A barra de navegação principal. Utiliza os hooks `useAuth`, `useTheme`, e `useSidebar` para funcionalidade.
    *   **Páginas (`src/pages/`)**: Componentes que representam as diferentes seções da aplicação (Login, Início, Agenda, Clientes).

---

## Histórico de Tarefas e Mudanças

### Tarefa Atual: Varredura e Limpeza do Sistema

*   **Objetivo:** Diagnosticar e resolver uma série de erros que estavam impedindo a aplicação de funcionar, causados por uma arquitetura de contextos desorganizada e conflitante.

*   **Passos de Execução (Concluídos):**
    1.  **Diagnóstico:** A varredura inicial, solicitada pelo usuário, revelou a existência de múltiplos arquivos duplicados e conflitantes para os contextos de Autenticação, Tema e Sidebar.
    2.  **Unificação do `AuthContext`:** A lógica de autenticação foi consolidada em um único arquivo mestre (`src/context/auth.jsx`), com a criação de um hook `useAuth` para consumo simplificado. O arquivo duplicado foi eliminado.
    3.  **Unificação do `ThemeContext`:** A lógica de tema foi consolidada em `src/contexts/ThemeContext.jsx`, adotando a melhor implementação (com persistência em `localStorage`) e criando o hook `useTheme`. Os arquivos redundantes foram eliminados.
    4.  **Unificação do `SidebarContext`:** A lógica de estado da sidebar foi unificada em `src/context/sidebarContext.jsx`, com a criação do hook `useSidebar`. Os arquivos conflitantes foram eliminados.
    5.  **Reparo de Importações:** Uma varredura subsequente foi realizada para encontrar e corrigir todas as declarações `import` que apontavam para os arquivos deletados. Os componentes `Sidebar.jsx` e `main.jsx` foram os principais alvos e foram devidamente corrigidos.
    6.  **Correção da Hierarquia de Provedores:** O arquivo `main.jsx` foi reestruturado para garantir que todos os provedores de contexto (`Router`, `AuthProvider`, `ThemeProvider`, `SidebarProvider`) fossem aninhados na ordem correta, disponibilizando o estado global para toda a aplicação.

*   **Resultado:** A base de código está agora limpa, organizada e funcional. Os erros de compilação foram resolvidos.

---

## Próximos Passos

*   Aguardando a próxima diretiva do usuário.
