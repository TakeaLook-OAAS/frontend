# ─────────────────────────────────────────────
# Stage 1: deps — 의존성만 설치
# ─────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# package.json & lock 파일만 먼저 복사 (레이어 캐시 최적화)
COPY package.json package-lock.json* ./

RUN npm ci

# ─────────────────────────────────────────────
# Stage 2: builder — 소스 빌드
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# deps 스테이지에서 node_modules 가져오기
COPY --from=deps /app/node_modules ./node_modules

# 전체 소스 복사
COPY . .

# Next.js 텔레메트리 비활성화 (선택)
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ─────────────────────────────────────────────
# Stage 3: runner — 프로덕션 실행
# ─────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 보안: 비-root 유저 생성
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Next.js standalone 빌드 결과물 복사
COPY --from=builder /app/public         ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# ── Volume Mount Points ──────────────────────
# /app/public          : 정적 파일 (이미지, 폰트 등) 실시간 반영
# /app/.next/static    : 빌드된 정적 에셋
# /app/logs            : 런타임 로그 수집용 (옵션)
VOLUME ["/app/public", "/app/.next/static", "/app/logs"]

CMD ["node", "server.js"]
