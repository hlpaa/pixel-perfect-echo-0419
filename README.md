# Ração em Dia — MVP de reposição de ração

Uma solução para tutores de cães e gatos organizarem a reposição de ração antes que o pacote acabe. O visitante monta um plano no site, recebe uma estimativa de duração e continua o atendimento pelo WhatsApp. A operação acompanha leads, clientes, entregas e lembretes em um painel administrativo.

Este README documenta o **MVP efetivamente criado**, não todas as funcionalidades previstas no projeto inicial. As análises de negócio são hipóteses a validar; não representam vendas, receita ou tração já comprovadas.

## 1. Aplicação publicada

**Endereço público:** https://pixel-perfect-echo-0419.lovable.app

- Montar um plano: https://pixel-perfect-echo-0419.lovable.app/montar-plano
- Entrar: https://pixel-perfect-echo-0419.lovable.app/auth
- Painel administrativo, restrito a administradores: https://pixel-perfect-echo-0419.lovable.app/admin

## 2. A dor escolhida e por que ela vale um negócio

**Dor:** o tutor precisa comprar ração repetidamente, mas nem sempre sabe quando o pacote vai terminar ou lembra de pedir a reposição com antecedência. Isso pode gerar compras de última hora, deslocamentos e dificuldade para manter a rotina de alimentação do pet.

**Público inicial proposto:** tutores de cães e gatos que usam ração industrializada e aceitam combinar entregas pelo WhatsApp, em uma região que a operação consiga atender. A cidade e a área de cobertura ainda não foram definidas neste projeto.

**Por que há uma oportunidade:**

- A ração é um item de consumo recorrente: uma primeira entrega pode gerar novas compras.
- O peso do pacote e o consumo diário permitem estimar o momento da próxima reposição.
- Lembretes e atendimento próximo podem reduzir o esforço de lembrar e comprar.
- O WhatsApp permite começar com atendimento humano, sem exigir que o cliente crie uma conta ou aprenda um sistema novo.
- Uma operação local pode testar conveniência e recompra antes de investir em automação e logística complexas.

**Modelo de receita proposto:** margem sobre a venda da ração e, se fizer sentido para a região, uma taxa de entrega combinada no atendimento. Não há preço, margem, taxa ou assinatura pagos definidos no MVP. O “plano” é uma organização da reposição, não uma assinatura com cobrança automática.

**Riscos a validar:** competição por preço com pet shops e grandes varejistas, custo de entrega, disponibilidade das marcas, precisão da estimativa de consumo e disposição do cliente para recomprar por esse canal. Mercado grande não é prova de demanda por esta solução.

## 3. Tamanho de mercado

### Referência nacional

Como referência histórica, o mercado pet brasileiro faturou **R$ 75,4 bilhões em 2024**, com crescimento de **9,6%** sobre 2023. Alimentos industrializados para animais de estimação movimentaram **R$ 40,8 bilhões**, ou **54,1%** do total, segundo o balanço Abinpet/IPB divulgado pela entidade setorial. [1](https://abempet.org.br/informacoes-gerais-do-setor/)

Esses valores são de **2024**, não uma estimativa de faturamento de 2026. Pet food inclui mais do que a reposição local de ração para cães e gatos; portanto, R$ 40,8 bilhões é uma referência ampla, não o mercado diretamente capturável pelo Ração em Dia.

### TAM, SAM e SOM

| Recorte | Definição para este negócio | Situação |
| --- | --- | --- |
| TAM — mercado total | Referência ampla: alimentos industrializados para pets no Brasil | R$ 40,8 bilhões/ano em 2024; o recorte específico de cães e gatos não foi quantificado aqui |
| SAM — mercado atendível | Tutores de cães e gatos nos bairros atendidos, que compram as rações disponíveis e aceitam entrega/WhatsApp | Ainda não calculado: faltam região, quantidade de compradores elegíveis e gasto médio |
| SOM — parcela alcançável | Clientes que a operação consegue conquistar, atender e reter no piloto | Ainda não comprovado: depende de aquisição, conversão, recompra e capacidade de entrega |

**Como calcular o recorte local:**

```text
SAM anual = compradores elegíveis na região × gasto médio anual em ração
SOM anual = clientes ativos alcançáveis × compras por ano × ticket médio
```

**Exemplo apenas ilustrativo, não dado do projeto:** com 1.000 compradores elegíveis e gasto de R$ 150 por mês, o SAM seria de R$ 1,8 milhão por ano. Se a operação atendesse 50 clientes com uma compra mensal de R$ 150, o SOM seria de R$ 90 mil por ano em vendas brutas. Isso não é lucro, meta aprovada nem receita realizada; os valores precisam ser substituídos por pesquisa local e resultados do piloto.

## 4. Business Model Canvas

Canvas proposto a partir do fluxo criado; parceiros, custos e receitas ainda precisam de validação comercial.

| Bloco | Aplicação ao Ração em Dia |
| --- | --- |
| **Segmentos de clientes** | Tutores de cães e gatos que compram ração regularmente, querem evitar compras de última hora e moram na área atendida |
| **Proposta de valor** | Organizar a reposição com estimativa de duração, lembrete e atendimento humano para combinar a entrega |
| **Canais** | Página pública, formulário de plano e WhatsApp; indicações e parcerias locais são canais possíveis a testar, não integrações existentes |
| **Relacionamento com clientes** | Atendimento pessoal no WhatsApp, confirmação da entrega e contato antes da próxima reposição |
| **Fontes de receita** | Margem na venda da ração; possível taxa de entrega. Sem assinatura ou cobrança automática no MVP |
| **Recursos principais** | Aplicação, registros de clientes e consumo, operador de atendimento, acesso a fornecedores e capacidade de entrega |
| **Atividades principais** | Captar leads, conversar e fechar vendas, obter a ração, organizar entregas, registrar a operação e acompanhar recompra |
| **Parcerias principais** | Potenciais fornecedores/pet shops, distribuidores e entregadores locais; nenhum parceiro foi confirmado neste projeto |
| **Estrutura de custos** | Compra de ração, entrega, tempo de atendimento, aquisição de clientes, hospedagem/operação da aplicação e tributos |

## 5. A tese que o MVP testa

> Se o tutor puder informar a ração e o consumo do pet, entender aproximadamente quando o pacote acaba e combinar a reposição pelo WhatsApp, haverá clientes dispostos a comprar e recomprar pela conveniência de não precisar lembrar de tudo sozinhos.

O MVP testa **demanda por reposição assistida**, não preferência por uma plataforma completa, assinatura automática ou recomendação nutricional.

### Experimento proposto

1. Atrair tutores de uma região definida para a página pública.
2. Observar quantos enviam o formulário e continuam a conversa no WhatsApp.
3. Fechar a primeira venda manualmente e marcar o lead como cliente.
4. Registrar a entrega no painel e acompanhar o lembrete gerado.
5. Fazer o contato de reposição e verificar se há uma segunda compra.
6. Comparar margem, custo de aquisição, entrega e tempo de atendimento.

### O que medir

| Indicador | Cálculo / registro |
| --- | --- |
| Conversão da página | Formulários enviados ÷ visitantes; visitantes exigem uma medição adicional |
| Continuidade no WhatsApp | Conversas efetivamente iniciadas ÷ formulários enviados; confirmar manualmente |
| Conversão em cliente | Leads marcados como cliente ÷ leads recebidos |
| Recompra | Clientes com nova compra ÷ clientes cujo primeiro ciclo de consumo terminou |
| Resultado por entrega | Valor recebido − custo da ração − entrega − demais custos variáveis |
| Esforço operacional | Tempo de atendimento e organização por cliente/entrega |

O painel guarda leads, status, entregas e valores opcionais, mas **não calcula automaticamente todos esses indicadores**. Não há metas de aprovação definidas nem resultados reais documentados. Abrir o WhatsApp não comprova envio de mensagem; marcar “Cliente” é uma atualização do operador, não uma confirmação automática de pagamento.

## 6. O que foi criado

### Página pública (`/`)

- Proposta de reposição de ração para cães e gatos.
- Imagem de cão e gato, seção “Como funciona” e chamada “Montar meu plano”.
- Links para Sobre, Contato, Termos e Privacidade, ainda com conteúdo provisório.

### Formulário (`/montar-plano`)

- Dados do pet: nome, espécie e peso opcional.
- Dados da ração: marca/linha, peso do pacote e consumo diário em gramas.
- Dados do tutor: nome, WhatsApp, bairro e observações.
- Estimativa de duração: `floor(pacote em kg × 1.000 ÷ consumo diário em gramas)`.
- Exemplo: pacote de 10 kg com consumo de 200 g/dia dura aproximadamente 50 dias.
- Gravação do lead e abertura do WhatsApp da loja com mensagem preparada.
- Confirmação “Plano recebido!” e botão para abrir o WhatsApp caso a abertura automática seja bloqueada.
- Não exige conta do visitante; a estimativa não substitui orientação veterinária nem garante a data exata do fim da ração.

### Painel administrativo (`/admin`)

- Login e verificação de acesso de administrador.
- **Leads:** dados enviados e estados Novo, Em conversa, Cliente e Perdido; botão de WhatsApp.
- **Clientes:** leads que o operador marcou como Cliente.
- **Entregas:** registro por cliente, data, peso do pacote e valor opcional; atualização de Agendada para Entregue ou Cancelada.
- **Lembretes:** pendências ordenadas por data, destaque para hoje/atrasado, botão “Avisar” e marcação “Concluído”.
- **Configurações:** número de WhatsApp da loja que recebe os planos.

Ao registrar uma entrega, o fluxo cria um lembrete **5 dias antes do término estimado**, sem colocá-lo antes da data da entrega quando o pacote durar menos de 5 dias. A estimativa usa a data informada no registro, não uma confirmação automática da entrega ou da abertura do pacote. Registrar entrega e criar lembrete são duas operações separadas; eventual falha na segunda exige conferência do operador.

## 7. O que ficou manual de propósito

| Etapa | Responsabilidade humana no MVP | Motivo |
| --- | --- | --- |
| Venda | Conversar no WhatsApp, confirmar produto, preço e condições | Aprender objeções e validar demanda antes de automatizar |
| Pagamento | Combinar e conferir fora da aplicação | Evitar checkout e cobrança recorrente antes da validação |
| Conversão do lead | Marcar como Cliente, Em conversa ou Perdido | Manter o fluxo simples e acompanhar o funil |
| Entrega | Combinar endereço e horário, organizar a logística e atualizar o status | Testar cobertura e custo sem integração com transportadoras |
| Reposição | Conferir lembretes, abrir o WhatsApp, enviar a mensagem e marcar como concluído | Validar se o lembrete gera recompra antes de disparos automáticos |
| Análise do piloto | Conferir indicadores e custos em acompanhamento externo | O foco inicial é operação e aprendizado, não um sistema completo de análises |

**Já automatizado:** cálculo da duração, armazenamento do formulário, preparação dos links/mensagens e criação do lembrete no fluxo de registro da entrega. O WhatsApp não envia mensagens sozinho; a aplicação não confirma pagamento nem executa entregas.

**Fora do escopo atual:** área completa do cliente, cadastro de vários pets por conta, onboarding em etapas, gestão completa de catálogo/estoque, pedidos com checkout, assinatura paga, rastreamento logístico, notificações automáticas por WhatsApp/SMS/e-mail e recomendação de ração por IA. Algumas estruturas do banco do projeto inicial existem, mas isso não significa que essas telas e fluxos tenham sido entregues.

## 8. Mega prompt e correções posteriores

### Origem do projeto

O desenvolvimento começou com o documento anexado **“Projeto Ração em Dia — Plataforma de Reposição”**, que previa uma plataforma mais ampla: login, área do cliente, pets, previsões, planos, pedidos, notificações e administração. Depois, o escopo foi reduzido para o MVP de página pública, formulário, WhatsApp e painel operacional.

### Mega prompt consolidado do MVP

O texto abaixo é uma **reconstrução documentada**, baseada no pedido e no que foi criado. Não é uma transcrição literal do documento anexado nem de um único prompt original.

```text
Crie o Ração em Dia, um MVP em português do Brasil para organizar a
reposição de ração de cães e gatos. O fluxo deve ser simples:
página pública → montar plano → conversar pelo WhatsApp.

Crie uma página pública que explique a proposta, mostre como funciona
e tenha um botão “Montar meu plano”, usando a identidade visual do
projeto e uma imagem de cão e gato.

Crie um formulário público, sem exigir conta do visitante, com:
nome e espécie do pet, peso opcional, marca/linha da ração, peso do
pacote em kg, consumo diário em gramas, nome do tutor, WhatsApp,
bairro e observações. Calcule a duração aproximada do pacote:
floor(kg × 1.000 ÷ gramas por dia).

Ao enviar, salve um lead no Lovable Cloud e abra o WhatsApp da loja
com os dados do plano em uma mensagem preparada. Exiba confirmação
e um botão alternativo para abrir o WhatsApp.

Crie um painel restrito a administradores com abas:
- Leads: dados, status Novo/Em conversa/Cliente/Perdido e WhatsApp.
- Clientes: leads marcados como Cliente.
- Entregas: cliente, data, peso do pacote, valor opcional e status.
- Lembretes: data, contato pelo WhatsApp e marcação de conclusão.
- Configurações: número de WhatsApp da loja.

Ao registrar uma entrega, crie um lembrete 5 dias antes do fim
estimado da ração, nunca anterior à data registrada da entrega.
Proteja os dados operacionais com login e acesso administrativo.
Inclua testes do cálculo de duração e dos links do WhatsApp.

A venda, o pagamento, a logística e o envio das mensagens ficam
manuais. Não crie checkout, assinatura automática, integração com
transportadoras ou uma área completa do cliente neste MVP.
```

### Pedidos de correção e adaptação registrados

1. **13/11/2026 — corrigir erros e retomar o trabalho.** Pedido literal:

   > Fix the remaining TypeScript build errors, including the `mode` index-signature access in `src/routes/auth.tsx`, then resume the pending work.

   Foi corrigido o acesso ao parâmetro `mode` com notação de colchetes (`s["mode"]`) e criada a página inicial no lugar da tela em branco. Também houve ajustes anteriores nos links do cabeçalho/rodapé para não apontarem a páginas ainda inexistentes.

2. **13/11/2026 — reduzir e adaptar o escopo.** Pedido literal:

   > Uma landing page que explica a proposta;
   >
   > Um formulário para a pessoa montar o próprio plano;
   >
   > O contato pelo WhatsApp, onde a venda se fecha;
   >
   > Um painel de administração com leads, clientes, entregas e lembretes.
   >
   > adapte isso, o que falata para fecharmos o MVP?

   A implementação passou a priorizar o formulário público, o fechamento pelo WhatsApp e o painel com essas quatro áreas. Foram criados os registros de leads, entregas e lembretes, ajustados os links públicos e o destino após o login para o painel.

3. **15/11/2026 — documentar a entrega.** Foi solicitado este README com a dor, oportunidade, tamanho de mercado, Canvas, tese, trabalho manual, mega prompt, correções e endereço publicado.

## 9. Estado da entrega e cuidados antes do piloto

- O histórico registra que o formulário foi exercitado no navegador e apresentou “Plano recebido!” após salvar o lead.
- O histórico também registra testes das regras de previsão e semáforo; o projeto contém testes adicionais de duração, datas e links do WhatsApp.
- O painel existe no código, mas a última resposta ao usuário não confirmou uma validação completa dele no navegador. Não tratar o fluxo administrativo inteiro como comprovado apenas por essa documentação.
- Configurar e confirmar o WhatsApp real da loja em **Painel → Configurações**. Sem esse número, o formulário não direciona o contato corretamente à operação.
- Conferir a conta administrativa. A implementação inicial atribui o papel de administrador ao cadastro quando ainda não existe administrador; proteger esse primeiro cadastro antes da divulgação.
- Revisar os conteúdos provisórios de Sobre, Contato, Termos e Privacidade e definir como tratar os dados dos clientes.
- Definir área de entrega, fornecedores, disponibilidade, preços, taxas e custos: nenhum desses dados comerciais foi fornecido como definitivo.
- Conferir o lead de teste citado no histórico e excluí-lo da análise comercial; o painel atual não oferece botão para apagá-lo.
- Fazer um teste completo com número real: enviar plano, receber conversa, converter lead, registrar entrega, conferir lembrete e realizar o contato de reposição.

Essas pendências operacionais não devem ser confundidas com as etapas deixadas manuais de propósito.

## 10. Informações técnicas

Construído com Lovable, React, TypeScript, TanStack Start/Router, Tailwind CSS e componentes de interface. Lovable Cloud fornece banco de dados e autenticação. O WhatsApp é acessado por links com mensagens preparadas, não por uma integração de envio automático.

Principais arquivos:

| Arquivo | Responsabilidade |
| --- | --- |
| `src/routes/index.tsx` | Página pública |
| `src/routes/montar-plano.tsx` | Formulário e encaminhamento ao WhatsApp |
| `src/routes/admin.tsx` | Leads, clientes, entregas, lembretes e configurações |
| `src/routes/auth.tsx` | Entrada e cadastro |
| `src/lib/plan.ts` | Duração do pacote, soma de dias e links do WhatsApp |
| `src/lib/forecast.ts` | Regras de previsão e semáforo do projeto inicial |

Para desenvolvimento local, com Bun instalado e a configuração do ambiente do projeto disponível:

```sh
bun install
bun run dev
```

Para executar os testes:

```sh
bun run test
```

Não versionar credenciais privadas. A aplicação depende da configuração de Lovable Cloud; instalar as dependências não cria nem preenche um novo ambiente de dados automaticamente.
