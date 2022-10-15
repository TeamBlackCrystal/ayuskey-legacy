FROM node:18.10.0-alpine3.15 AS base

WORKDIR /misskey

FROM base AS builder

RUN apk add --no-cache \
    autoconf \
    automake \
    file \
    g++ \
    gcc \
    libc-dev \
    libtool \
    make \
    nasm \
    pkgconfig \
    python3 \
    zlib-dev \
		git

COPY . ./

RUN corepack enable pnpm &&
    pnpm i --frozen-lockfile

ENV NODE_ENV=production

RUN pnpm build

FROM base AS runner

RUN apk add --no-cache \
    ffmpeg \
    tini &&
	  corepack enable pnpm

ENTRYPOINT ["/sbin/tini", "--"]

COPY --from=builder /misskey/node_modules ./node_modules
COPY --from=builder /misskey/built ./built
COPY . ./

ENV NODE_ENV=production

CMD ["pnpm", "migrateandstart"]
