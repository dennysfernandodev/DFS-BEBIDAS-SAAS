# Chatbot de atendimento com IA

## Objetivo

Atender clientes de adegas, conveniências, lanchonetes, pizzarias e restaurantes pelo WhatsApp e pela loja virtual, conduzindo a conversa até a criação segura do pedido.

## Princípio central

A IA interpreta linguagem e redige respostas. Dados comerciais são sempre obtidos por ferramentas internas.

A IA não pode inventar:

- produtos;
- preços;
- promoções;
- disponibilidade;
- taxa de entrega;
- prazo;
- forma de pagamento aceita;
- status de pedido.

## Arquitetura híbrida

1. O canal recebe a mensagem.
2. O adaptador valida assinatura, tenant, loja e idempotência.
3. O roteador determinístico identifica intenções claras.
4. Intenções ambíguas podem ser classificadas pelo provedor de IA.
5. O orquestrador chama ferramentas de catálogo, carrinho, endereço, taxa, pagamento e pedido.
6. A resposta final é validada antes do envio.
7. Conversas de risco, cancelamento, reclamação ou solicitação explícita são transferidas para humano.

## Intenções iniciais

- saudação;
- mostrar cardápio;
- buscar produto;
- adicionar e remover item;
- visualizar carrinho;
- receber endereço;
- calcular taxa;
- escolher pagamento;
- confirmar pedido;
- consultar status;
- cancelar;
- falar com atendente.

## Estados da conversa

- `START`;
- `DISCOVERY`;
- `BUILDING_CART`;
- `WAITING_ADDRESS`;
- `WAITING_PAYMENT`;
- `WAITING_CONFIRMATION`;
- `ORDER_CREATED`;
- `HUMAN_HANDOFF`;
- `CLOSED`.

## Segurança

- toda mensagem possui `messageId` idempotente;
- cada sessão é isolada por `tenantId`, `storeId` e telefone;
- preço e taxa precisam estar fundamentados em registros ativos;
- confirmação exige carrinho, endereço, taxa e pagamento;
- dados de pagamento não entram no prompt da IA;
- logs não devem armazenar QR PIX, token, senha ou segredo de API;
- limite de tamanho por mensagem;
- timeout e fallback quando o provedor de IA falhar;
- transferência humana sempre disponível.

## Persistência

A implementação inicial usa memória apenas como esqueleto executável. Antes da produção, a sessão será movida para Redis e o histórico/auditoria para PostgreSQL. Isso permite múltiplas réplicas da API sem perda de estado.

## Ferramentas que serão conectadas

- `searchCatalog`;
- `getProductDetails`;
- `addCartItem`;
- `removeCartItem`;
- `getCart`;
- `resolveDeliveryZone`;
- `quoteDelivery`;
- `setPaymentMethod`;
- `createOrder`;
- `getOrderStatus`;
- `handoffToHuman`.

## Endpoint inicial

`POST /api/chatbot/messages`

O endpoint retorna a resposta e uma lista de ações internas. Nesta etapa ele não envia mensagens diretamente ao WhatsApp. O adaptador Evolution API/Baileys será responsável pelo recebimento e envio.

## Próximas implementações

1. repositório Redis para sessões;
2. tabelas PostgreSQL para conversas e mensagens;
3. ferramentas reais de catálogo e carrinho;
4. integração com o resolvedor de taxas de Planaltina;
5. adaptador Evolution API;
6. provedor de IA configurável;
7. fila de mensagens e retry;
8. painel de atendimento humano;
9. métricas, custo e auditoria;
10. testes de integração e carga.
