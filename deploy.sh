#!/usr/bin/env bash
set -e

echo "=================================================="
echo "🚀 [DEPLOY] Iniciando processo de atualização..."
echo "=================================================="

# Detect docker command (docker compose or docker-compose)
DOCKER_COMPOSE="docker compose"
if ! docker compose version &>/dev/null; then
  if command -v docker-compose &>/dev/null; then
    DOCKER_COMPOSE="docker-compose"
  fi
fi

# Ensure .env exists in current working dir for Docker
if [ ! -f .env ]; then
  if [ -f ~/Desenvolvimento/central-associacao/.env ]; then
    cp ~/Desenvolvimento/central-associacao/.env .env
  elif [ -f ~/.env ]; then
    cp ~/.env .env
  fi
fi

# 1. Baixar as últimas alterações do repositório (se aplicável)
echo "📦 1/4 Verificando código atualizado..."
git pull origin main 2>/dev/null || true

# 2. Reconstruir e subir os containers Docker
echo "🐳 2/4 Reconstruindo e iniciando containers Docker..."
$DOCKER_COMPOSE up -d --build --remove-orphans

# 3. Aplicar migrações do banco de dados PostgreSQL via Prisma
echo "🗄️  3/4 Aplicando migrações no banco de dados..."
$DOCKER_COMPOSE exec -T backend pnpm prisma migrate deploy || true

# 4. Limpar imagens Docker antigas/não utilizadas para economizar disco
echo "🧹 4/4 Limpando imagens docker antigas..."
docker image prune -f || true

echo "=================================================="
echo "✅ [DEPLOY OK] Aplicação atualizada com sucesso!"
echo "=================================================="
