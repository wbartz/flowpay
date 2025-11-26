# FlowPay

Sistema de distribuição automática de tickets baseado em **Teams**, **Agents** e **Queue**, com arquitetura orientada a eventos (**Observer/PubSub**).

---

## 📌 Características

* Distribuição automática de tickets ao serem criados
* Redistribuição ao criar/editar/remover agentes
* Redistribuição ao atualizar times
* Cada agente atende até **3 tickets simultâneos**
* Fila com IDs incrementais garantindo ordenação estável
* Arquitetura desacoplada usando **Event Bus**
* Testes completos (unitários + integração)
* Factories e mocks para 100% coverage

---

## 🚀 Tecnologias Utilizadas

* Node.js
* Express
* Jest + Supertest (100% Coverage)
* Pub/Sub nativo (EventEmitter ou EventBus customizado)
* ESLint (Standard Style)
* Husky + hooks

---

## 📁 Estrutura do Projeto

```
src/
  core/
    eventBus.js
  domain/
    entities/
      Ticket.js
      Agent.js
      Team.js
    factories/
      TicketFactory.js
      AgentFactory.js
      TeamFactory.js
  application/
    services/
      TicketService.js
      AutoDistributionService.js
  infrastructure/
    http/
      routes/
        ticketRoutes.js
      server.js

__tests__/
  unit/
    eventBus.mock.js
    TicketFactory.test.js
    AgentFactory.test.js
    TeamFactory.test.js
    eventEmission.test.js
    listeners.test.js
  integration/
    autoDistribution.test.js
    ticketFlow.test.js
```

---

## 🧪 Testes

Rodar todos os testes com cobertura:

```
npm test
```

Cobertura mínima configurada: **100%**.

---

## ▶️ Execução

Ambiente de desenvolvimento:

```
npm run dev
```

Produção:

```
npm start
```

## 📜 Licença

MIT
