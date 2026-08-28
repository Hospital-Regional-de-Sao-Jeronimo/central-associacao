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
  for env_path in \
    ~/Desenvolvimento/central-associacao/.env \
    /home/pablosantos/Desenvolvimento/central-associacao/.env \
    /home/mateus/Desenvolvimento/central-associacao/.env \
    ~/.env \
    ../.env
  do
    if [ -f "$env_path" ]; then
      cp "$env_path" .env
      break
    fi
  done

  if [ ! -f .env ] && [ -f .env.example ]; then
    cp .env.example .env
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
