# Lease: Gerenciador de Locações de Serviços

!GitHub commit activity  
!GitHub last commit

**Lease** é um projeto full-stack para gerenciamento de locações de serviços, construído com uma arquitetura moderna e foco em boas práticas de desenvolvimento e DX (Developer Experience).

---

🔗 **Links do Projeto**

- **Aplicação:** <https://lease.playground.tec.br>
- **Documentação da API:** <https://api.playground.tec.br/reference>
- **Branch de desenvolvimento:** [alpha](https://github.com/ClaudionorOjr/lease/tree/alpha)

---

## ✨ Pontos Fortes e Destaques

Este projeto foi desenvolvido com foco em qualidade de código, escalabilidade e uma ótima experiência para o desenvolvedor.

### 🏛️ **Arquitetura de Backend Robusta**

- **Princípios Sólidos:** A base do código segue padrões como **DDD, SOLID e Clean Architecture**, garantindo um sistema desacoplado e de fácil manutenção.
- **Injeção de Dependências:** Utiliza **Tsyringe** para gerenciar dependências, promovendo baixo acoplamento e alta testabilidade.
- **Testes Abrangentes:** Cobertura de testes unitários e end-to-end com **Vitest**, facilitada pelo uso do **Factory Pattern**.
- **Validação Segura:** Validação de dados de ponta a ponta com **Zod**.
- **Documentação de API Interativa:** Geração automática de documentação OpenAPI (Swagger) com uma interface moderna e amigável fornecida pelo **Scalar**, facilitando o teste e a compreensão dos endpoints.

### 🎨 **Frontend Moderno e Reativo**

- **Next.js 15:** Construído com a versão mais recente do Next.js, aproveitando as últimas features do React para performance e experiência do usuário.
- **UI com Shadcn/UI:** Utiliza uma biblioteca de componentes "copy-paste" que são totalmente customizáveis e acessíveis, construídos sobre Radix UI e Tailwind CSS.
- **Estilização com Tailwind CSS:** Adota uma abordagem *utility-first* para criar interfaces modernas e responsivas de forma rápida e consistente.
- **Validação de Formulários com Zod:** Integração com React Hook Form para uma validação de esquemas robusta e tipada, tanto no cliente quanto no servidor.


### 🚀 **Developer Experience (DX) e Automação**

- **Monorepo Eficiente:** Gerenciado com **Turborepo** para otimizar builds, testes e o fluxo de trabalho em um único repositório.
- **Código Padronizado:** **Biome.js** é usado como linter e formatter unificado, garantindo consistência e performance.
- **CI/CD Automatizado:** **GitHub Actions** automatiza a execução de testes e a criação de releases.
- **Versionamento Semântico:** **Semantic Release** e **Commitizen** trabalham juntos para padronizar commits e gerar o `CHANGELOG.md` automaticamente.
- **Sincronia entre Frontend e Backend:** **Orval** gera um cliente de API tipado, eliminando a necessidade de manter manualmente as chamadas à API no frontend.

### 💻 **Tecnologias Utilizadas**

<p align="left">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify">
  <img src="https://img.shields.io/badge/postgresql-4169E1.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/prisma-%232D3748.svg?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/shadcn-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="Shadcn/UI">
  <img src="https://img.shields.io/badge/turborepo-%23000000.svg?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo">
</p>

---

## 🚀 Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/ClaudionorOjr/lease.git
    cd lease
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    - Renomeie o arquivo `.env.example` na raiz do projeto para `.env`.
    - Preencha as variáveis necessárias para o banco de dados e autenticação.

4.  **Inicie o banco de dados com Docker:**
    ```bash
    npm run db:start
    ```

5.  **Execute as migrações do Prisma:**
    ```bash
    npm run db:migrate
    ```

6.  **Inicie os servidores de desenvolvimento:**
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:3000` e o servidor da API em `http://localhost:3333`.

---

## 📝 Anotações de Desenvolvimento

<details>
  <summary><strong>Variáveis de Ambiente no Monorepo</strong></summary>

  Para carregar as variáveis do arquivo `.env` da raiz nos pacotes (`server`, `client`), o `server` utiliza o `dotenv-cli`. A configuração está no `package.json` do respectivo pacote.

  Instalar `@t3-oss/env-nextjs` no package `env` para configurar as variáveis de ambiente para o server e client;

  ```bash
  npm i @t3-oss/env-nextjs
  ```

  Instalar `dotenv-cli` no `server` para conseguir passar as variáveis de ambiente para os comandos de alguns scripts, já que o arquivo .env agora está na raiz do monorepo, então é necessário passar o caminho até o arquivo;

  ```bash
  npm i dotenv-cli -D
  ```

  Configuração no `package.json`:

  ```json
  {
    "scripts": {
      "dev": "npm run env:load -- tsx watch src/http/server.ts",
      "env:load": "dotenv -e ../../.env"
    }
  }
  ```
</details>

<details>
  <summary><strong>Outras Anotações</strong></summary>

  **Traduções:**
  ```txt
  locador — lessor
  locatário — lessee
  locação — leasing
  locações — leases
  ```

  **Comandos Git Úteis:**
  ```bash
  # Para resetar o cache de um diretório
  git rm -r --cached apps/client
  git add apps/client
  ```
</details>
