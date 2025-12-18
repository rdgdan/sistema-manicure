
# By Borges - Sistema de Agendamento para Salões de Beleza

Prévia da Aplicação

## Visão Geral

**By Borges** é um sistema de gerenciamento de clientes e agendamentos completo, construído com as tecnologias mais modernas de React. Projetado para ser intuitivo, responsivo e visualmente deslumbrante, este projeto é a solução perfeita para pequenos negócios, como salões de beleza, barbearias e estúdios, que precisam de um sistema robusto e fácil de usar.

Este projeto é de **código aberto** e foi desenvolvido para ser facilmente personalizável e "white-label". Com este guia, qualquer desenvolvedor pode configurar, adaptar e vender este sistema como um serviço para seus próprios clientes.

---

## ✨ Funcionalidades Principais

*   **Gestão Completa de Agendamentos:** Crie, edite, visualize e exclua agendamentos em um calendário interativo.
*   **Cadastro de Clientes:** Mantenha um banco de dados de seus clientes com informações de contato.
*   **Catálogo de Serviços:** Organize seus serviços em categorias e defina preços e durações.
*   **Fluxo de Trabalho Inteligente:** Crie novos clientes e novas categorias de serviço diretamente nos modais de agendamento e serviço, sem interromper sua tarefa.
*   **Design Moderno e Responsivo:** Uma interface de usuário premium que funciona perfeitamente em desktops e dispositivos móveis.
*   **Tema Claro e Escuro:** Adapte a aparência para a preferência do usuário ou para as condições de iluminação.
*   **Backend Robusto com Firebase:** Utiliza o Firestore do Firebase, um banco de dados NoSQL em tempo real, para uma performance segura e escalável.
*   **Componentes Reutilizáveis:** Construído com uma arquitetura de componentes limpa e de fácil manutenção.

---

## 🚀 Guia de Início Rápido para Desenvolvedores

Este guia detalha como configurar o projeto, conectá-lo ao seu próprio backend do Firebase e personalizá-lo para seus clientes.

### Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão 18 ou superior)
*   [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
*   [Git](https://git-scm.com/)
*   Uma conta no [Google](https://google.com) para usar o Firebase.

### Passo 1: Clonar e Instalar

Primeiro, clone o repositório para sua máquina local e instale todas as dependências necessárias.

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/by-borges-app.git

# Navegue até o diretório do projeto
cd by-borges-app

# Instale as dependências
npm install
```

### Passo 2: Configurar o Firebase e as Variáveis de Ambiente

Este sistema usa o Firebase para banco de dados. As chaves de acesso são gerenciadas de forma segura através de variáveis de ambiente.

1.  **Crie um Projeto no Firebase:**
    *   Acesse o [console do Firebase](https://console.firebase.google.com/).
    *   Clique em "**Adicionar projeto**".
    *   Dê um nome ao seu projeto (ex: `cliente-salao-app`) e siga as instruções.

2.  **Crie um Banco de Dados Firestore:**
    *   No menu lateral do seu projeto, clique em **Construir > Firestore Database**.
    *   Clique em "**Criar banco de dados**" e inicie no **modo de produção**.
    *   Escolha uma localização. Para o Brasil, `southamerica-east1` é recomendado.
    *   **Regras de Segurança:** Vá para a aba "**Regras**" e cole as seguintes regras para desenvolvimento. **Atenção: Para produção, estude e implemente regras mais restritivas.**
        ```
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /{document=**} {
              allow read, write: if true; // PERMITE TUDO - APENAS PARA DESENVOLVIMENTO
            }
          }
        }
        ```

3.  **Obtenha as Chaves de Configuração do Firebase:**
    *   Nas "**Configurações do projeto**" (ícone de engrenagem), vá para a seção "**Seus apps**".
    *   Clique no ícone da web (`</>`) para criar um novo aplicativo da web.
    *   Registre o aplicativo e o Firebase fornecerá um objeto `firebaseConfig`. Você precisará das chaves deste objeto.

4.  **Configure o Arquivo `.env`:**
    *   Na raiz do seu projeto, você encontrará um arquivo chamado `.env.example`. Este é o seu template.
    *   **Copie** este arquivo e **renomeie a cópia** para `.env`.
    *   Abra o novo arquivo `.env` e preencha cada variável com as chaves correspondentes do objeto `firebaseConfig` que você obteve do Firebase.

    ```env
    # Substitua pelas suas chaves reais do Firebase
    VITE_API_KEY="SUA_API_KEY"
    VITE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
    VITE_PROJECT_ID="SEU_PROJECT_ID"
    VITE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
    VITE_MESSAGING_SENDER_ID="SEU_MESSAGING_SENDER_ID"
    VITE_APP_ID="SUA_APP_ID"
    ```

    O código da aplicação em `src/firebase.js` já está configurado para ler estas variáveis de ambiente automaticamente. O arquivo `.gitignore` impede que seu arquivo `.env` seja enviado para o GitHub, mantendo suas chaves seguras.

### Passo 3: Rodar a Aplicação

Com o Firebase configurado, você pode iniciar o servidor de desenvolvimento.

```bash
npm run dev
```

Abra seu navegador e acesse `http://localhost:5173`. A aplicação estará rodando, conectada ao **seu** banco de dados!

---

## 🎨 Customização e White-Labeling

Para vender este serviço, você precisará personalizar a marca e a aparência.

*   **Mudar o Tema e as Cores:**
    *   Abra `src/index.css`.
    *   Altere as variáveis de cor dentro das seções `:root` (tema escuro) e `[data-theme='light']` (tema claro) para combinar com a marca do seu cliente.

*   **Alterar Nomes e Logos:**
    *   **Nome da Aplicação:** Procure por "By Borges" em componentes como `src/components/Sidebar.jsx` e substitua pelo nome do seu cliente.
    *   **Logo:** Substitua ou adicione os novos logos do seu cliente e atualize os componentes que os utilizam.
    *   **Título da Página:** Altere o `<title>` no arquivo `index.html` na raiz do projeto.

## ☁️ Implantação (Deploy)

Quando a customização estiver pronta, é hora de colocar a aplicação online.

1.  **Gere a Build de Produção:**
    ```bash
    npm run build
    ```
    Este comando cria uma pasta `dist` com todos os arquivos estáticos otimizados.

2.  **Faça o Deploy:**
    Você pode hospedar a pasta `dist` em qualquer serviço de hospedagem de sites estáticos. **Vercel** e **Netlify** são excelentes opções com planos gratuitos generosos e integração contínua com o GitHub.
