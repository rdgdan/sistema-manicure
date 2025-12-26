# By Borges - Sistema de Gestão de Barbearia (White-Label)

Este é um sistema completo de gestão para barbearias e salões, construído com React e Firebase. O projeto foi desenhado para ser **White-Label**, permitindo que qualquer desenvolvedor o personalize, configure e revenda para seus próprios clientes com facilidade.

## Funcionalidades Principais

- **Autenticação Segura:** Cadastro e login com E-mail/Senha e Google.
- **Dashboard Intuitivo:** Visualização rápida de estatísticas e próximos agendamentos.
- **Gestão de Agendamentos:** Um calendário completo para marcar, visualizar e gerenciar horários.
- **Cadastro de Clientes:** Mantenha um registro de todos os seus clientes.
- **Gestão de Serviços:** Crie e edite os serviços oferecidos pelo estabelecimento.
- **Painel de Administração Robusto:**
  - **Gestão de Usuários:** Visualize todos os usuários do sistema.
  - **Controle de Permissões:** Promova ou remova o status de administrador de qualquer usuário com um clique.
  - **Edição de Usuários:** Altere o nome e o e-mail de exibição dos usuários.
  - **Redefinição de Senha:** Envie e-mails de redefinição de senha diretamente do painel.
- **Design Moderno e Responsivo:** Interface limpa e adaptável a desktops e dispositivos móveis.

---

## Guia de Configuração para Desenvolvedores

Siga estes passos para configurar o ambiente de desenvolvimento e conectar a aplicação ao seu próprio backend do Firebase.

### 1. Pré-requisitos

- **Node.js:** Versão 20.x ou superior.
- **Conta no Firebase:** [Crie uma conta gratuita no Firebase](https://firebase.google.com/).

### 2. Clonar e Instalar

Clone o repositório para a sua máquina local e instale as dependências.

```bash
npm install
```

### 3. Configuração do Firebase

Esta é a etapa mais importante. Você precisa criar um projeto no Firebase para servir como backend da sua aplicação.

1.  **Crie um Projeto Firebase:**
    *   Acesse o [Console do Firebase](https://console.firebase.google.com/) e clique em "Adicionar projeto".
    *   Siga as instruções para criar um novo projeto.

2.  **Adicione a Aplicação Web:**
    *   Dentro do seu projeto, clique no ícone de engrenagem (Configurações do Projeto) e vá para a seção "Seus apps".
    *   Clique no ícone `</>` para adicionar um aplicativo da Web.
    *   Dê um nome ao seu aplicativo e registre-o.

3.  **Obtenha as Chaves de Configuração:**
    *   Após o registro, o Firebase fornecerá um objeto de configuração (`firebaseConfig`) com suas chaves de API. Copie este objeto.

4.  **Crie o Arquivo de Conexão (`firebase.js`):
    *   Na raiz do seu projeto React, localize o arquivo `src/firebase.js`.
    *   Substitua o conteúdo existente pelas suas próprias chaves de configuração:

    ```javascript
    // Em src/firebase.js
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";
    import { getAuth, GoogleAuthProvider } from "firebase/auth";

    const firebaseConfig = {
      apiKey: "SUA_API_KEY",
      authDomain: "SEU_AUTH_DOMAIN",
      projectId: "SEU_PROJECT_ID",
      storageBucket: "SEU_STORAGE_BUCKET",
      messagingSenderId: "SEU_MESSAGING_SENDER_ID",
      appId: "SEU_APP_ID"
    };

    const app = initializeApp(firebaseConfig);
    export const db = getFirestore(app);
    export const auth = getAuth(app);
    export const googleProvider = new GoogleAuthProvider();
    ```

5.  **Ative os Serviços no Firebase:**
    *   No menu lateral do seu projeto Firebase, vá para **Authentication**:
        *   Clique na aba "Sign-in method".
        *   Ative os provedores **E-mail/senha** e **Google**.
    *   Ainda no menu lateral, vá para **Firestore Database**:
        *   Clique em "Criar banco de dados".
        *   Inicie no **modo de produção** (production mode) para maior segurança e clique em Avançar.
        *   Escolha um local para o seu servidor e clique em "Ativar".

### 4. Configurando o Primeiro Administrador

Para ter acesso ao painel de administração, você precisa definir um "Super Administrador".

1.  **Abra o Contexto de Autenticação:**
    *   Navegue até `src/contexts/AuthContext.jsx`.

2.  **Altere o E-mail do Super Admin:**
    *   Encontre a constante `SUPER_ADMIN_EMAIL` e altere o valor para o seu e-mail principal. Este será o primeiro e principal administrador do sistema.

    ```javascript
    // Em src/contexts/AuthContext.jsx
    const SUPER_ADMIN_EMAIL = 'seu-email@exemplo.com'; // <-- MUDE ESTA LINHA
    ```

3.  **Faça Login pela Primeira Vez:**
    *   Inicie a aplicação (`npm run dev`).
    *   Cadastre-se e faça login com o e-mail que você definiu como `SUPER_ADMIN_EMAIL`.
    *   O sistema automaticamente concederá privilégios de administrador a esta conta. A partir daí, você poderá promover outros usuários pelo painel de administração.

### 5. Personalizando os E-mails (Branding do Cliente)

Para que os e-mails de verificação e redefinição de senha tenham a marca do seu cliente, siga os passos:

1.  No Console do Firebase, vá em **Authentication** > **Templates**.
2.  Selecione o template que deseja editar (ex: "Redefinição de senha").
3.  **Altere o Nome do Remetente** para o nome da barbearia do seu cliente.
4.  **Altere o Idioma** para Português (ou o idioma local).
5.  **Personalize o corpo do e-mail** com o nome e a mensagem do seu cliente, usando as variáveis do Firebase (ex: `%APP_NAME%`, `%LINK%`).

---

## Como Executar a Aplicação

Após seguir o guia de configuração, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Estrutura do Projeto

- `src/components`: Componentes reutilizáveis (Sidebar, Modais, etc.).
- `src/contexts`: Contextos globais da aplicação (Autenticação, Dados).
- `src/pages`: As páginas principais da aplicação (Dashboard, Admin, etc.).
- `src/firebase.js`: Arquivo de configuração e inicialização do Firebase.
- `public/`: Arquivos estáticos.

## Licença e Monetização

Este projeto é distribuído sob a licença MIT. Você tem total liberdade para usar, modificar, distribuir e **vender** este software como parte de um serviço para seus clientes. Crie sua própria versão, hospede para uma barbearia local e cobre uma taxa de manutenção ou setup.
