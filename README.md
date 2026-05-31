# Simple To-do App

Aplicação de lista de tarefas construída com Next.js 16, React 19, Tailwind CSS e autenticação via NextAuth.

Esse projeto foi criado com o intuito de aprender Next.js 16, NextAuth e Prisma.

 - Link produção: https://simpletodolist.mocha.vercel.app

## Descrição

Permite que usuários cadastrem e façam login usando credenciais ou Google, criem listas de tarefas, adicionem tarefas, marquem como concluídas e excluam itens.

A aplicação usa:

- Next.js App Router
- NextAuth para autenticação (Google e Credentials)
- Prisma com PostgreSQL
- Tailwind CSS
- Prisma Adapter para autenticação com banco Postgres

## Funcionalidades

- Cadastro e login de usuário
- Login via Google
- Criação de listas de tarefas
- Visualização de listas do usuário autenticado
- Adição de tarefas em listas específicas
- Marcar tarefas como concluídas
- Exclusão de tarefas e listas
- Proteção de rotas para usuários não autenticados

## Estrutura do projeto

- `app/` — página inicial, login, registro e rotas protegidas
- `app/api/auth/[...nextauth]/route.ts` — rota do NextAuth
- `app/lib/db.ts` — cliente Prisma com conexão PostgreSQL
- `app/lib/actions.ts` — ações de servidor para criar/excluir listas e tarefas
- `app/ui/` — componentes de interface
- `prisma/schema.prisma` — modelo de dados

## Requisitos

- Node.js 20+
- pnpm
- PostgreSQL

## Instalação

1. Instale dependências:

```bash
pnpm install
```

2. Crie arquivo `.env` na raiz do projeto com as variáveis abaixo:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
AUTH_GOOGLE_ID=seu_google_client_id
AUTH_GOOGLE_SECRET=seu_google_client_secret
```

3. Aplique as migrações do Prisma:

```bash
pnpm prisma migrate dev
```

4. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

5. Acesse a aplicação em:

```text
http://localhost:3000
```

## Scripts

- `pnpm dev` — inicia o servidor de desenvolvimento
- `pnpm build` — gera a versão de produção
- `pnpm start` — inicia a aplicação em modo de produção
- `pnpm lint` — executa o ESLint

## Variáveis de ambiente

- `DATABASE_URL` — string de conexão com PostgreSQL
- `AUTH_GOOGLE_ID` — Client ID do Google OAuth
- `AUTH_GOOGLE_SECRET` — Client Secret do Google OAuth

## Notas

- O projeto usa `next-auth` com `session.strategy = 'jwt'`.
- As listas e tarefas são salvas por usuário autenticado.
- O backend usa Prisma com o `PrismaPg` adapter para PostgreSQL.

## Licença

Este projeto está disponível para uso pessoal e adaptação.
