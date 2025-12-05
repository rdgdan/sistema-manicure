
# Blueprint do Projeto: Sistema de Agendamento "Aurora"

## Visão Geral

O objetivo deste projeto é criar um sistema de agendamento de clientes (CRM) moderno, intuitivo e visualmente atraente para um salão de beleza. A aplicação será um Single-Page Application (SPA) construído com React, utilizando Vite para o ambiente de desenvolvimento. O design, codinome "Aurora" (escuro) e "Pêssego Chic" (claro), prioriza uma experiência de usuário limpa, com elementos de "glassmorphism", tipografia moderna e interatividade fluida.

---

## Recursos Implementados (Até Agora)

### **Fase 1: Estrutura e Design Visual**

*   **Autenticação:**
    *   Tela de Login com e-mail/senha e login via Google.
    *   Contexto de autenticação (`AuthContext`) para gerenciar o estado do usuário.
*   **Estrutura de Navegação:**
    *   **Sidebar Recolhível:** Menu lateral para navegação principal entre as páginas.
    *   **Roteamento:** Uso do `react-router-dom` para gerenciar as rotas da aplicação (`/`, `/agenda`, `/login`).
*   **Páginas Principais:**
    *   **Dashboard:** Tela inicial com cartões de KPI (Key Performance Indicators) e gráficos de evolução de receita e clientes.
    *   **Agenda:** Calendário interativo para visualização, criação e edição de agendamentos.
*   **Design System ("Aurora" / "Pêssego Chic"):**
    *   **Tema Duplo:** Implementação de um tema escuro ("Aurora") e um tema claro ("Pêssego Chic") com troca dinâmica.
    *   **Contexto de Tema (`ThemeContext`):** Gerencia o estado do tema (claro/escuro) em toda a aplicação.
    *   **Estilos Globais (`index.css`):** Define as paletas de cores, fontes, e um fundo animado com "blobs" de gradiente.
    *   **Componentes Estilizados:** Todos os componentes (`Sidebar`, `Dashboard`, `Login`, `Agenda`) foram estilizados para seguir a nova identidade visual, utilizando o efeito "glassmorphism", bordas com "glow" e animações sutis.

---

## Plano de Ação - Fase 2 (Correções de UI/UX)

### **Problema Identificado:**

Após a implementação do novo design, surgiram falhas críticas de layout e funcionalidade que quebraram a experiência do usuário.

*   O modal da Agenda está sendo renderizado incorretamente atrás da grade do calendário.
*   A funcionalidade de recolher/expandir da Sidebar parou de funcionar.
*   O botão "Sair" na Sidebar está visualmente cortado e não executa a ação de logout.

### **Passos para a Correção:**

1.  **Correção da Sidebar:**
    *   **Layout do Botão "Sair":** Ajustar o CSS (`Sidebar.css`) para garantir que o rodapé da sidebar e seu conteúdo sejam sempre visíveis, corrigindo o problema do botão cortado. Provavelmente, um ajuste no `flexbox` é necessário.
    *   **Funcionalidade do Botão de Recolher/Expandir:** Investigar o `SidebarContext.jsx` e o `Sidebar.jsx` para encontrar por que o estado `isCollapsed` não está sendo atualizado ou por que a classe CSS `collapsed` não está sendo aplicada corretamente. Corrigir o manipulador de clique (`onClick`).
    *   **Funcionalidade do Botão "Sair":** Verificar o manipulador de clique (`handleLogout`) no `Sidebar.jsx` para garantir que a função `logout` do `AuthContext` seja chamada e que a navegação para `/login` ocorra como esperado.

2.  **Correção do Modal da Agenda:**
    *   **Ajuste de Z-index:** Modificar o `Agenda.css` para atribuir um `z-index` mais alto ao backdrop do modal e ao seu conteúdo, garantindo que eles apareçam *sobre* o componente do calendário.
    *   **Refinamento do Estilo:** Revisar os estilos do modal para garantir que ele esteja bem posicionado, legível e consistente com o restante do design "Aurora".

