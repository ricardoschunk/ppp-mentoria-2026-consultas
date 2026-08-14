# API de Consultas de Fisioterapia

API REST em Node.js e Express para cadastro de pacientes e agendamento de consultas de fisioterapia. Os dados ficam em memória e são apagados sempre que o processo é reiniciado.

## Funcionalidades

- cadastro de paciente com nome completo e telefone;
- autenticação JWT com separação entre os perfis `patient` e `physiotherapist`;
- consulta de horários disponíveis e agendamento de sessões de uma hora;
- listagem dos próprios agendamentos pelo paciente;
- login do fisioterapeuta e listagem administrativa de todos os agendamentos;
- documentação OpenAPI renderizada pelo Swagger UI;
- respostas de erro padronizadas e testes de integração.

As sessões começam em horas cheias, de `07:00` até `18:00`. Assim, a última sessão termina às `19:00`. Um horário só pode ter um agendamento.

## Requisitos

- Node.js 18 ou superior
- npm

## Instalação e execução

```bash
npm install
npm start
```

A API ficará disponível em `http://localhost:3000` e o Swagger UI em `http://localhost:3000/api-docs`. O documento OpenAPI bruto também pode ser consultado em `http://localhost:3000/api-docs.json`.

Para desenvolvimento com reinício automático:

```bash
npm run dev
```

## Configuração

As configurações são lidas de variáveis de ambiente. O arquivo `.env.example` lista as opções, mas a aplicação não carrega arquivos `.env` automaticamente.

| Variável | Valor padrão | Finalidade |
| --- | --- | --- |
| `PORT` | `3000` | Porta HTTP |
| `JWT_SECRET` | chave apenas para desenvolvimento | Assinatura dos JWTs |
| `JWT_EXPIRES_IN` | `8h` | Validade dos tokens |
| `ADMIN_USERNAME` | `fisioterapeuta` | Login administrativo |
| `ADMIN_PASSWORD` | `admin123` | Senha administrativa |

Defina `JWT_SECRET`, `ADMIN_USERNAME` e `ADMIN_PASSWORD` com valores seguros antes de usar fora do ambiente local.

Exemplo no PowerShell:

```powershell
$env:JWT_SECRET = "uma-chave-forte"
$env:ADMIN_USERNAME = "profissional"
$env:ADMIN_PASSWORD = "uma-senha-forte"
npm.cmd start
```

## Fluxo de autenticação

1. O paciente chama `POST /api/patients`. A resposta inclui seus dados e um JWT de perfil `patient`.
2. O paciente envia esse token em `Authorization: Bearer <token>` para consultar disponibilidade, agendar e listar suas consultas.
3. O fisioterapeuta chama `POST /api/admin/login`. A resposta inclui um JWT de perfil `physiotherapist`.
4. O token administrativo autoriza apenas o painel `GET /api/admin/appointments`.

Um token de paciente não acessa o painel administrativo, e um token administrativo não acessa as rotas exclusivas do paciente.

## Endpoints

| Método | Endpoint | Perfil | Descrição |
| --- | --- | --- | --- |
| `GET` | `/health` | Público | Estado da API |
| `POST` | `/api/patients` | Público | Cadastra paciente e emite JWT |
| `GET` | `/api/appointments/available?date=YYYY-MM-DD` | Paciente | Lista horários livres |
| `POST` | `/api/appointments` | Paciente | Agenda uma consulta |
| `GET` | `/api/appointments/mine` | Paciente | Lista as próprias consultas |
| `POST` | `/api/admin/login` | Público | Login do fisioterapeuta |
| `GET` | `/api/admin/appointments` | Fisioterapeuta | Lista todas as consultas |
| `GET` | `/api-docs` | Público | Renderiza o Swagger UI |
| `GET` | `/api-docs.json` | Público | Retorna o arquivo OpenAPI |

O contrato completo dos corpos JSON, parâmetros e status de sucesso e erro está em [`src/resources/swagger.json`](src/resources/swagger.json).

## Documentação de testes

A pasta [`docs`](docs) reúne os artefatos de planejamento e especificação dos testes do projeto:

- [`docs/charters`](docs/charters): contém os test charters de Pacientes, Agendamentos e Administração, usados para orientar as sessões de testes exploratórios;
- [`docs/test cases`](docs/test%20cases): contém os test cases detalhados, com os cenários de cadastro de paciente, validação de agendamento e visualização no painel administrativo.

Os documentos estão no formato `.docx` e podem ser consultados antes da execução dos testes para entender o objetivo, o escopo e os resultados esperados de cada cenário.

## Exemplos

Cadastro de paciente:

```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Maria da Silva","phone":"11999999999"}'
```

Agendamento com o token retornado pelo cadastro:

```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"date":"2026-08-10","time":"09:00"}'
```

Login administrativo:

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"fisioterapeuta","password":"admin123"}'
```

## Respostas

Sucessos usam o envelope `data`:

```json
{
  "data": {}
}
```

Erros usam o envelope `error`:

```json
{
  "error": {
    "code": "TIME_UNAVAILABLE",
    "message": "Este horário não está disponível."
  }
}
```

## Arquitetura

```text
docs/
├── charters/     # test charters para testes exploratórios
└── test cases/   # casos de teste detalhados
src/
├── controllers/  # traduz HTTP para chamadas de serviço
├── middlewares/  # autenticação, autorização e erros
├── models/       # armazenamento em memória
├── resources/    # arquivo Swagger/OpenAPI
├── routes/       # definição dos endpoints
├── services/     # regras de negócio
├── utils/        # erros da aplicação
├── app.js        # composição do Express
└── server.js     # inicialização HTTP
```

## Testes

```bash
npm test
```

Os testes usam o executor nativo do Node.js e cobrem cadastro, conflito de horários, limites da agenda, JWT, autorização por perfil, visão administrativa e Swagger UI.
