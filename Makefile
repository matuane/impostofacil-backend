.PHONY: up down restart logs ps clean

# Variáveis de ambiente padrão
DB_NAME=impostofacil
DB_USER=postgres
DB_PASSWORD=postgres
DB_PORT=5432

# Inicia os containers
up:
	docker-compose up -d

# Para os containers
down:
	docker-compose down

# Reinicia os containers
restart:
	docker-compose restart

# Mostra os logs dos containers
logs:
	docker-compose logs -f

# Lista os containers em execução
ps:
	docker-compose ps

# Remove volumes e containers
clean:
	docker-compose down -v
	docker-compose rm -f

# Acessa o banco de dados via psql
db:
	docker-compose exec db psql -U $(DB_USER) -d $(DB_NAME)

# Cria o banco de dados (se não existir)
create-db:
	docker-compose exec db createdb -U $(DB_USER) $(DB_NAME)

# Remove o banco de dados
drop-db:
	docker-compose exec db dropdb -U $(DB_USER) $(DB_NAME)

# Executa as migrações do prisma
migrate:
	npx prisma migrate dev

# Gera os tipos do prisma
generate:
	npx prisma generate

# Reseta o banco de dados
reset-db: drop-db create-db migrate

# Ajuda
help:
	@echo "Comandos disponíveis:"
	@echo "  make up          - Inicia os containers"
	@echo "  make down        - Para os containers"
	@echo "  make restart     - Reinicia os containers"
	@echo "  make logs        - Mostra os logs dos containers"
	@echo "  make ps          - Lista os containers em execução"
	@echo "  make clean       - Remove volumes e containers"
	@echo "  make db          - Acessa o banco de dados via psql"
	@echo "  make create-db   - Cria o banco de dados"
	@echo "  make drop-db     - Remove o banco de dados"
	@echo "  make migrate     - Executa as migrações do prisma"
	@echo "  make generate    - Gera os tipos do prisma"
	@echo "  make reset-db    - Reseta o banco de dados" 