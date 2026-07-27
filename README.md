# DFS Bebidas SaaS

Plataforma SaaS multiempresa para conveniências, adegas e depósitos de bebidas.

## Objetivo

Centralizar catálogo, estoque, pedidos, clientes, pagamentos, entregas e atendimento por WhatsApp em uma única solução hospedável em VPS.

## Arquitetura inicial

- `apps/api`: API principal em NestJS
- `apps/admin-web`: painel administrativo em Next.js
- `apps/store-web`: loja virtual/PWA em Next.js
- `apps/chatbot-worker`: processamento assíncrono de mensagens e automações
- `packages/database`: Prisma e modelos do PostgreSQL
- `packages/contracts`: DTOs, eventos e contratos compartilhados
- `packages/ui`: componentes visuais compartilhados
- `infrastructure`: Docker, proxy, observabilidade e scripts

## Stack

- Node.js 22
- TypeScript
- pnpm workspaces
- Turborepo
- NestJS
- Next.js
- PostgreSQL
- Prisma ORM
- Redis
- Docker Compose
- Evolution API
- n8n

## Primeira execução

1. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

2. Suba os serviços de infraestrutura:

```bash
docker compose up -d postgres redis
```

3. Instale as dependências:

```bash
pnpm install
```

4. Gere o Prisma Client:

```bash
pnpm db:generate
```

5. Crie a primeira migração:

```bash
pnpm db:migrate
```

## Princípios do projeto

- Isolamento multiempresa por `tenantId`
- Nenhuma credencial sensível no frontend
- Auditoria das operações críticas
- Integrações externas desacopladas
- Estoque e preços sempre consultados no banco
- Chatbot sem autorização para inventar produtos, preços ou descontos

## Status

Fundação técnica em construção.
