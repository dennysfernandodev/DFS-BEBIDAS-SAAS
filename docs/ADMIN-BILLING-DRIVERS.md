# Painel administrativo, cobrança e motoboys DFS

## Perfis

### Super Admin DFS
Controle total do SaaS: comerciantes, lojas, usuários, motoboys, planos, assinaturas, cobranças, integrações, auditoria, backups e bloqueios.

### Comerciante
Acessa apenas o próprio tenant: pedidos, catálogo, estoque, clientes, funcionários, chatbot, zonas, taxas, relatórios e cobrança da própria assinatura.

### Motoboy
Cadastro operacional separado. Não recebe acesso ao painel do comerciante. Pode ser aprovado, bloqueado, suspenso ou inativado e futuramente terá PWA próprio.

## Cobrança do SaaS

Entidades previstas:

- `Plan`: nome, preço em centavos, periodicidade e limites;
- `Subscription`: comerciante, plano, status, início, renovação e cancelamento;
- `Invoice`: competência, vencimento, valor, status e referência externa;
- `InvoicePayment`: método, valor, identificador do provedor e data de pagamento;
- `BillingEvent`: auditoria de webhooks e mudanças de estado.

Nunca armazenar dados completos de cartão. O provedor de pagamento deve tokenizar os dados. Webhooks devem ser assinados, idempotentes e persistidos antes do processamento.

Estados recomendados para assinatura: `TRIAL`, `ACTIVE`, `PAST_DUE`, `SUSPENDED`, `CANCELED`.

Política inicial recomendada:

1. vencimento da mensalidade;
2. aviso automático ao comerciante;
3. período de tolerância configurável;
4. bloqueio apenas de recursos comerciais, mantendo acesso à cobrança e exportação de dados;
5. reativação automática após confirmação do pagamento.

## Cadastro de comerciantes

Fluxo:

1. criar responsável e empresa;
2. validar CPF/CNPJ, telefone e e-mail;
3. criar tenant e loja inicial;
4. escolher plano;
5. configurar WhatsApp, cidade e zonas;
6. criar usuário administrador;
7. registrar aceite dos termos;
8. ativar manualmente ou após pagamento.

## Cadastro de motoboys DFS

Dados operacionais:

- nome e telefone;
- documento;
- CNH, quando aplicável;
- placa e tipo de veículo;
- cidade e regiões atendidas;
- status de aprovação;
- bloqueios e motivo;
- entregas aceitas, concluídas, canceladas e atrasadas;
- histórico de auditoria.

Dados sensíveis devem ser protegidos e acessíveis somente a perfis autorizados. Documentos não serão enviados aos grupos do WhatsApp.

## Regras da DFS

- somente motoboy aprovado pode aceitar entrega;
- primeira aceitação válida vence, com trava transacional;
- bloqueados são rejeitados antes da atribuição;
- prazo padrão de chegada ao comércio: 10 minutos;
- entrega estimada: 10 a 20 minutos conforme região;
- abandono e atraso geram evento operacional;
- toda alteração administrativa gera auditoria;
- rastreamento GPS permanece fora da primeira versão, mas o domínio deve suportá-lo posteriormente.

## Frontend

Aplicações previstas:

- `apps/admin`: painel central DFS;
- `apps/merchant`: painel do comerciante;
- `apps/storefront`: loja pública;
- `apps/driver`: PWA futura do motoboy.

O primeiro dashboard central já foi criado em `apps/admin`.

## Segurança obrigatória antes de produção

- autenticação com hash forte de senha;
- access token curto e refresh token rotativo;
- RBAC por papel e tenant;
- 2FA para Super Admin;
- rate limiting;
- logs sem credenciais ou documentos;
- trilha de auditoria imutável;
- backups criptografados e testados;
- segregação de segredos por ambiente;
- validação de entrada e proteção CSRF quando aplicável.
