##### dev-base #####
FROM node:22.14 as dev-base
WORKDIR /app
EXPOSE 3000
EXPOSE 3001
EXPOSE 3002

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm && pnpm add -g pnpm@10.8.1

##### dev #####
FROM dev-base as dev
ENV NODE_ENV=development

COPY --chown=node:node ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
COPY --chown=node:node ./apps/backend/package.json ./apps/backend/
COPY --chown=node:node ./apps/frontend/package.json ./apps/frontend/
COPY --chown=node:node ./packages/eslint-config/package.json ./packages/eslint-config/
COPY --chown=node:node ./packages/ui/package.json ./packages/ui/

RUN pnpm install && \
  chown -R node:node . && \
  chown -R node:node $PNPM_HOME

COPY --chown=node:node . .

USER node

RUN pnpm config set store-dir $PNPM_HOME/store --global
