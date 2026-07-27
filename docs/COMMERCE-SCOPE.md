# Escopo comercial multi-segmento

O produto deve atender vários tipos de comércio sem criar versões separadas do sistema.

## Segmentos iniciais

- adegas e distribuidoras de bebidas;
- lojas de conveniência;
- lanchonetes;
- restaurantes;
- pizzarias;
- padarias;
- pequenos mercados.

## Catálogo

O catálogo precisa suportar:

- produto simples;
- bebida;
- alimento preparado;
- produto vendido por peso;
- combos;
- preço promocional;
- estoque por loja;
- imagem e descrição;
- tempo de preparo por produto;
- observações do cliente;
- grupos de opções;
- quantidade mínima e máxima por grupo;
- opções obrigatórias;
- adicionais com acréscimo de preço.

Exemplos:

- pizza com tamanho, sabores, borda e adicionais;
- hambúrguer com ponto da carne, retirada de ingredientes e extras;
- marmita com tamanho, proteína e acompanhamentos;
- bebida com volume, marca e opção gelada;
- combo com produtos e complementos.

## Pedidos

Canais previstos:

- loja virtual;
- WhatsApp;
- painel administrativo;
- telefone;
- balcão.

Formas de atendimento:

- entrega;
- retirada;
- consumo no local.

## Regra multiempresa

Toda consulta operacional deve estar vinculada ao `tenantId`. O backend nunca deve confiar em um `tenantId` enviado livremente pelo frontend; ele deve ser obtido da sessão autenticada ou de um domínio público de loja validado.

## Regionalização

A primeira operação será em Planaltina de Goiás. Bairros, taxas, pedidos mínimos e tempo adicional devem ser cadastrados em `DeliveryZone`, sem regras fixas no código. Isso permite expandir depois para Brasília, outras cidades e múltiplas lojas.
