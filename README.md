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
  events/
    eventBus.js
  modules/
    agent/
      agent.entity.ts
      agent.listener.ts
      agent.repository.ts
      agent.schema.ts
      agent.service.ts
    team/
      team.entity.ts
      team.repository.ts
      team.schema.ts
      team.service.ts
    ticket/
      ticket.entity.ts
      ticket.listener.ts
      ticket.repository.ts
      ticket.schema.ts
      ticket.service.ts
  routes/
    agents.routes.ts
    teams.routes.ts
    tickets.routes.ts
  app.ts

__tests__/
  agent/
    agent.listener.test.ts
    agent.repository.test.ts
    agent.routes.test.ts
    agent.service.test.ts
  team/
    team.repository.test.ts
    team.routes.test.ts
    team.service.test.ts
  ticket/
    ticket.listener.test.ts
    ticket.repository.test.ts
    ticket.routes.test.ts
    ticket.service.test.ts

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
