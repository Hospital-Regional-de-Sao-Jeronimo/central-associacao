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

# Aguardar o banco de dados estar 100% pronto para aceitar conexões
echo "⏳ Aguardando PostgreSQL inicializar..."
until $DOCKER_COMPOSE exec -T postgres pg_isready -U ${POSTGRES_USER:-postgres} &>/dev/null; do
  sleep 1
done
echo "✅ PostgreSQL pronto para conexões!"

# 3. Criar backup (dump) de segurança do banco de dados antes da atualização
echo "💾 3/5 Gerando dump de segurança do banco de dados..."
mkdir -p backups
DUMP_FILENAME="backups/dump_central_associacao_$(date +%Y%m%d_%H%M%S).sql"
if $DOCKER_COMPOSE exec -T postgres pg_dump -U ${POSTGRES_USER:-postgres} ${POSTGRES_DB:-central_associacao} > "$DUMP_FILENAME" 2>/dev/null; then
  echo "✅ Backup salvo com sucesso em: $DUMP_FILENAME"
  # Guardar cópia em dump_central_associacao.sql principal
  cp "$DUMP_FILENAME" dump_central_associacao.sql 2>/dev/null || true
else
  echo "⚠️ Aviso: Não foi possível gerar dump automático do PostgreSQL, continuando..."
fi

# 4. Sincronizar esquema do banco de dados PostgreSQL e rodar seed do Admin
echo "🗄️  4/5 Sincronizando banco de dados e garantindo admin..."
$DOCKER_COMPOSE exec -T backend pnpm prisma db push
$DOCKER_COMPOSE exec -T backend pnpm prisma db seed

# 5. Limpar imagens Docker antigas/não utilizadas para economizar disco
echo "🧹 5/5 Limpando imagens docker antigas..."
docker image prune -f || true

# Ensure workspace permissions remain accessible to runner user
chown -R $USER:$USER . 2>/dev/null || true

echo "=================================================="
echo "✅ [DEPLOY OK] Aplicação atualizada com sucesso!"
echo "=================================================="
