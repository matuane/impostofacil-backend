# ImpostoFácil

Sistema para cálculo de impostos sobre operações de ações e FIIs.

## Descrição

O ImpostoFácil é uma aplicação que auxilia investidores pessoa física no cálculo de impostos sobre operações de compra e venda de ações e FIIs, seguindo as regras da Receita Federal.

## Requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/impostofacil.git
cd impostofacil
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
- Crie um banco de dados PostgreSQL chamado `impostofacil`
- Configure as credenciais no arquivo `src/config/database.ts`

4. Inicie o servidor em modo desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
├── config/         # Configurações do projeto
├── controllers/    # Controladores da aplicação
├── entities/       # Entidades do banco de dados
├── repositories/   # Repositórios para acesso aos dados
├── services/       # Lógica de negócio
└── index.ts        # Arquivo principal da aplicação
```

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Fastify
- TypeORM
- PostgreSQL

## Licença

Este projeto está licenciado sob a licença ISC. 