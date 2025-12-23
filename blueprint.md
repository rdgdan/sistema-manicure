# Blueprint do Projeto: By Borges - Nail Design

## Visão Geral

Este documento serve como a fonte central de verdade para a arquitetura, design e funcionalidades da aplicação "By Borges". É um sistema de gerenciamento de clientes e agendamentos construído em React, utilizando Firebase como backend e Vercel para deploy.

---

## Funcionalidade Essencial: Promoção de Administrador

Para garantir a segurança e o controle de acesso, o sistema utiliza um método de "promoção" para designar o administrador principal da aplicação. Isso evita a necessidade de ter e-mails de clientes no código-fonte e permite que cada implantação tenha seu próprio administrador.

### Como Funciona:

1.  **Variável de Ambiente:** No painel do projeto na Vercel (ou em um arquivo `.env.local` para desenvolvimento), uma variável de ambiente chamada `VITE_PENDING_ADMIN_EMAIL` deve ser configurada com o e-mail do usuário que será o administrador.

2.  **Primeiro Login:** Quando o usuário com o e-mail correspondente faz login pela primeira vez, o sistema identifica que ele é o "admin pendente".

3.  **Botão de Ativação:** Um painel especial de ativação aparecerá no topo do **Dashboard**. Este painel é visível apenas para este usuário específico e somente se ele ainda não tiver as permissões de administrador.

4.  **Ação Única:** Ao clicar no botão "Ativar Modo Administrador", o sistema executa uma chamada de API segura que atribui permanentemente a função de `admin` à conta daquele usuário no Firebase.

5.  **Conclusão:** A página recarrega, a permissão de admin é aplicada e o painel de ativação não aparecerá mais.

Este fluxo garante que apenas o proprietário do projeto (que tem acesso às variáveis de ambiente da Vercel) pode designar quem será o administrador.

---

## Histórico de Implementação

(O histórico anterior, incluindo a v2 sobre o fluxo de categoria, permanece inalterado e válido).

---

## Plano de Implementação Atual: Sistema de Promoção de Admin Sustentável

**Solicitação do Usuário:** Criar um método permanente e seguro para definir o administrador de uma nova implantação sem ter que modificar o código ou acessar o banco de dados diretamente. A solução deve ser reutilizável e fazer parte do fluxo de deploy.

**Plano de Ação Implementado:**

1.  **API Segura (`api/promoteToAdmin.js`):**
    *   Criada uma nova API que recebe um e-mail.
    *   **Validação Crítica:** A API só prossegue se o e-mail recebido for o mesmo definido na variável de ambiente `VITE_PENDING_ADMIN_EMAIL` no servidor.
    *   Encontra o usuário no Firebase pelo e-mail e atribui a ele a `custom claim` de `{ admin: true }`.
    *   A API antiga e insegura (`grantAdminAccess.js`) foi removida.

2.  **Interface Inteligente (`Dashboard.jsx`):**
    *   O componente agora lê a variável `import.meta.env.VITE_PENDING_ADMIN_EMAIL`.
    *   Renderiza um componente `AdminPromotionButton` somente se o e-mail do usuário logado corresponder à variável de ambiente e se ele ainda não for um admin.
    *   Este botão chama a nova API `/api/promoteToAdmin` para iniciar o processo de promoção.

3.  **Documentação (`blueprint.md`):**
    *   Este documento foi atualizado para detalhar o novo fluxo de promoção de administrador, servindo como guia para futuras implantações.

4.  **Próximo Passo:** Preparar os arquivos para o commit no Git.
