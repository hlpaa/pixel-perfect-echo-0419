# Ração em Dia — MVP de reposição de ração

Construir o MVP completo descrito no documento, em PT-BR, com Lovable Cloud (banco, login, regras de acesso). Entrega em fases dentro do mesmo build.

## Fase 1 — Base
- Ativar Lovable Cloud; login por e-mail/senha com recuperação de senha (página /reset-password).
- Design system com a paleta enviada (verde #1F6B5C, off-white #F8F7F2, laranja #F4A261, vermelho só para crítico), fonte Inter, cards arredondados e sombras discretas.
- Formato R$, DD/MM/AAAA, fuso padrão America/Recife (configurável pelo admin).

## Fase 2 — Área pública
- Landing (/) com header, hero "Seu pet sempre com a ração em dia.", Como funciona (3 etapas), Benefícios, CTA final e footer. Ilustração gerada de cão e gato com tigela. Sem depoimentos.
- Páginas simples: Sobre, Contato, Termos, Privacidade (textos-base para revisão).
- /auth (entrar / criar conta com nome, e-mail, senha, telefone).

## Fase 3 — Área do cliente (protegida)
- Onboarding em 4 etapas: pet(s) → alimentação → preferências de reposição → endereço → boas-vindas.
- Dashboard: próxima reposição, consumo mensal, pedidos, semáforo (verde/amarelo/vermelho), lista de pets, estado vazio "Cadastre seu primeiro pet", alertas.
- Pets: criar, editar, excluir; ração de cada pet (catálogo ou texto livre), consumo diário, data de abertura. Previsão = gramas do pacote ÷ consumo diário; sem consumo, sem previsão automática e opção de data manual; aviso "estimativa, não garantia".
- Planos de reposição: criar, editar, pausar, retomar, cancelar, antecipar, pedido avulso.
- Pedido em etapas: pet → ração → quantidade → endereço → resumo → confirmar. Acompanhamento de status.
- Central de notificações dentro do app (sem SMS/WhatsApp/e-mail).
- Navegação inferior simplificada no celular.

## Fase 4 — Painel administrativo (/admin, só administradores)
- Sidebar; dashboard com indicadores e gráficos reais (pedidos no tempo, por status, clientes no tempo).
- Clientes (busca, filtro, detalhes com pets e pedidos), Animais, Produtos (CRUD, ativar/desativar), Pedidos (detalhes, status, previsão de entrega, notas internas, cancelar, histórico), Planos (filtros, destaque de reposição próxima), Configurações.
- Mudança de status de pedido gera notificação ao cliente automaticamente.

## Segurança
- Papéis em tabela separada; cliente nunca consegue se tornar admin.
- Cada cliente vê só seus dados; admins gerenciam a operação; clientes veem apenas produtos ativos.
- Primeiro administrador: definido por um e-mail que você me informar (ou a primeira conta criada, se preferir).

## Dados de demonstração
- Apenas produtos de exemplo marcados "Demonstração" e sem preço real; nenhum cliente ou pedido fictício.

## Detalhes técnicos
- Tabelas: profiles, user_roles (+ has_role), pets, products, pet_foods, addresses, replenishment_plans, orders (order_number sequencial), order_items, order_status_history, notifications, app_settings. FKs, índices, GRANTs e RLS em todas.
- Triggers: criar profile no cadastro; recalcular estimated_end_date; registrar histórico e notificação ao mudar status do pedido.
- Rotas: /, /auth, /reset-password, /_authenticated/{onboarding, dashboard, pets, planos, pedidos, pedidos/novo, notificacoes, perfil}, /_authenticated/admin/* com checagem de papel.
- Leitura/escrita via cliente com RLS; recharts para gráficos.
- Testes vitest da regra de previsão (10 kg / 200 g = 50 dias; sem consumo = sem previsão) e do semáforo.
- Validação final no navegador dos cenários 1–8.

## Fora do escopo (conforme o documento)
Pagamentos, transportadoras, WhatsApp/SMS/e-mail automático, estoque de fornecedores, IA de recomendação.
