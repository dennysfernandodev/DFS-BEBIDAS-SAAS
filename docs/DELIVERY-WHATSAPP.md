# Fluxo de entrega por grupo do WhatsApp

## Escopo inicial

O sistema não utilizará rastreamento GPS do motoboy nesta fase. A arquitetura, porém, preserva os pontos necessários para adicionar localização, aplicativo do entregador e roteirização no futuro.

Cidade inicial: **Planaltina de Goiás - GO**.

## Fluxo operacional

1. O cliente conclui o pedido pela loja virtual, WhatsApp ou atendimento interno.
2. O comércio confirma o pedido.
3. O pedido entra em preparo.
4. Quando estiver pronto, muda para `READY`.
5. O serviço de despacho seleciona o grupo de motoboys configurado para a loja/cidade.
6. Uma mensagem sanitizada é publicada no grupo.
7. Os motoboys podem responder `PEGAR CODIGO`.
8. A primeira confirmação válida, processada com transação e trava no banco, recebe a entrega.
9. O pedido muda para `DRIVER_ASSIGNED`.
10. O sistema registra o prazo de chegada ao comércio.
11. Na retirada, o status muda para `PICKED_UP`/`OUT_FOR_DELIVERY`.
12. Na conclusão, muda para `DELIVERED`.

## SLA padrão

- Até **10 minutos** para o motoboy chegar ao comércio após aceitar.
- Meta de **20 minutos** para entregar após a retirada.
- Cada região poderá acrescentar tempo por meio de `DeliveryZone.estimatedMinutes`.
- Os limites devem ser configuráveis por loja e por região.

## Concorrência e segurança

A aceitação nunca deve ser resolvida apenas em memória. O serviço deve:

- abrir transação no PostgreSQL;
- bloquear o despacho ainda disponível;
- verificar `status = PUBLISHED`;
- registrar telefone e nome do primeiro motoboy válido;
- mudar o status para `ACCEPTED`;
- rejeitar confirmações posteriores de forma idempotente;
- armazenar um evento de auditoria.

## Privacidade

A mensagem no grupo não deve conter:

- telefone do cliente;
- CPF ou documento;
- token de pagamento;
- QR Code PIX;
- observações médicas ou pessoais;
- conteúdo completo do pedido quando desnecessário para a entrega.

O motoboy vencedor recebe os dados complementares em mensagem privada, conforme política da operação.

## Falhas previstas

- Se ninguém aceitar, republicar com limite configurável.
- Se o motoboy aceitar e não chegar no prazo, permitir liberação manual ou automática.
- Se a Evolution API estiver fora do ar, manter o despacho pendente em fila.
- Não duplicar mensagens quando houver retry.
- Cada publicação deve possuir uma chave idempotente baseada no `orderId`.

## Evolução futura

A estrutura permite acrescentar depois:

- cadastro formal de motoboys;
- reputação e bloqueios;
- aplicativo/PWA do entregador;
- localização em tempo real;
- prova de entrega;
- cálculo de rota;
- distribuição automática por proximidade;
- integração com a DFS Logística.
