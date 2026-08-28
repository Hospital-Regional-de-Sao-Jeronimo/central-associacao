#!/usr/bin/env bash

# ==============================================================================
# SCRIPT DE DEPLOY AUTOMÁTICO - CENTRAL DA ASSOCIAÇÃO (HRSJ)
# ==============================================================================
# Este script deve ser executado no servidor de produção.
# Ele baixa as atualizações do Git, reconstrói os containers e aplica as migrações.
# ==============================================================================

set -e # Aborta o script se algum comando retornar erro

echo "=================================================="
echo "🚀 [DEPLOY] Iniciando processo de atualização..."
echo "=================================================="

# 1. Baixar as últimas alterações do repositório
echo "📦 1/4 Baixando código atualizado da branch main..."
git pull origin main

# 2. Reconstruir e subir os containers Docker
echo "🐳 2/4 Reconstruindo e iniciando containers Docker..."
docker compose up -d --build --remove-orphans

# 3. Aplicar migrações do banco de dados PostgreSQL via Prisma
echo "🗄️  3/4 Aplicando migrações no banco de dados..."
docker compose exec -T backend pnpm prisma migrate deploy

# 4. Limpar imagens Docker antigas/não utilizadas para economizar disco
echo "🧹 4/4 Limpando imagens docker antigas..."
docker image prune -f

echo "=================================================="
echo "✅ [DEPLOY OK] Aplicação atualizada com sucesso!"
echo "=================================================="
