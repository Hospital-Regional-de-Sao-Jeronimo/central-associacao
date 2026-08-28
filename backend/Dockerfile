FROM node:22-alpine

WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@10.17.1 --activate

COPY .npmrc package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm prisma generate
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "run", "start"]
