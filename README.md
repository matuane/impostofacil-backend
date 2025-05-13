# ImpostoFácil

Sistema para gerenciamento e cálculo de imposto de renda sobre operações em bolsa de valores.

## 🎯 Objetivo

O ImpostoFácil é uma aplicação desenvolvida para simplificar o processo de gerenciamento e cálculo de impostos sobre operações em bolsa de valores. O sistema permite:

- Cadastro e gerenciamento de operações de compra e venda
- Cálculo automático de lucros e prejuízos
- Acompanhamento de carteira de investimentos
- Gestão de múltiplos usuários

## 🚀 Tecnologias

- Node.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Docker
- Make

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- Docker e Docker Compose
- Make (opcional, mas recomendado)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/impostofacil.git
cd impostofacil
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicie o banco de dados:
```bash
make up
```

5. Crie o banco de dados e execute as migrações:
```bash
make create-db
make migrate
```

6. Inicie a aplicação:
```bash
npm run dev
```

## 🛠️ Comandos Make Disponíveis

O projeto utiliza um Makefile para simplificar operações comuns:

- `make up` - Inicia os containers Docker
- `make down` - Para os containers
- `make restart` - Reinicia os containers
- `make logs` - Mostra logs dos containers
- `make ps` - Lista containers em execução
- `make clean` - Remove volumes e containers
- `make db` - Acessa o banco via psql
- `make create-db` - Cria o banco de dados
- `make drop-db` - Remove o banco de dados
- `make migrate` - Executa migrações do Prisma
- `make generate` - Gera tipos do Prisma
- `make reset-db` - Reseta o banco de dados
- `make help` - Mostra todos os comandos disponíveis

## 📦 Estrutura do Projeto

```
.
├── src/
│   ├── controllers/    # Controladores da aplicação
│   ├── entities/       # Entidades do domínio
│   ├── repositories/   # Repositórios para acesso ao banco
│   ├── services/       # Lógica de negócio
│   └── lib/           # Bibliotecas e configurações
├── prisma/            # Schemas e migrações do Prisma
├── tests/            # Testes automatizados
└── docker/           # Configurações Docker
```

## 🔍 API Endpoints

### Usuários
- `GET /users` - Lista todos os usuários
- `GET /users/:id` - Busca usuário por ID
- `POST /users` - Cria novo usuário
- `PUT /users/:id` - Atualiza usuário
- `DELETE /users/:id` - Remove usuário

### Operações
- `GET /operacoes` - Lista todas as operações
- `GET /operacoes/:id` - Busca operação por ID
- `POST /operacoes` - Cria nova operação
- `PUT /operacoes/:id` - Atualiza operação
- `DELETE /operacoes/:id` - Remove operação
- `GET /operacoes/periodo` - Busca operações por período

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Faça push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📅 Roadmap

### Versão 2.0 (Próxima)
- [ ] Importação de operações via arquivo PDF
- [ ] Reconhecimento automático de notas de corretagem
- [ ] Geração de relatórios em PDF
- [ ] Dashboard com gráficos de desempenho


### Versão 3.0
- [ ] App mobile


## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Funcionalidade Futura: Importação de PDF

Uma das principais funcionalidades planejadas é a importação automática de operações através de arquivos PDF de notas de corretagem. Esta feature incluirá:

- Upload de PDFs de diferentes corretoras
- Reconhecimento automático do layout da nota
- Extração inteligente de dados usando OCR
- Validação e correção manual de dados extraídos
- Importação em lote de múltiplas notas
- Histórico de importações
