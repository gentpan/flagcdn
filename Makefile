.PHONY: dev api web preview install build rastergen raster-verify

ROOT := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

# 本地预览（推荐）：Nuxt preview :3000 + Go API :8080
dev:
	@echo "Starting Go API :8080 + Nuxt preview :3000"
	@$(MAKE) -j2 api preview

api:
	@cd $(ROOT) && go run ./cmd/api -root .

# nuxt dev 在本机有 vite-node socket 问题，改用 build + preview
preview:
	@cd $(ROOT)apps/web && npm run build && npm run preview -- --port 3000

web:
	@cd $(ROOT)apps/web && npm run dev

install:
	@cd $(ROOT)apps/web && npm install

build:
	@cd $(ROOT)apps/web && npm run build
	@cd $(ROOT) && go build -o bin/flagcdn-api ./cmd/api

# 生产静态站（含 271 个国旗页 SSG + 完整 SEO meta）
# 构建期间需 Go API 在线（Nuxt 预渲染会请求 /api/v1/*）
build-static:
	@echo "Starting Go API for prerender..."
	@cd $(ROOT) && go run ./cmd/api -root . & echo $$! > /tmp/flagcdn-api.pid
	@sleep 1
	@cd $(ROOT)apps/web && npm run build; \
		status=$$?; \
		kill $$(cat /tmp/flagcdn-api.pid) 2>/dev/null || true; \
		rm -f /tmp/flagcdn-api.pid; \
		exit $$status
	@echo "Static output: apps/web/.output/public/ ($(shell ls $(ROOT)apps/web/.output/public/flag 2>/dev/null | wc -l | tr -d ' ') flag pages)"

rastergen:
	@cd $(ROOT) && go run ./cmd/rastergen -workers 12

raster-verify:
	@cd $(ROOT) && go run ./cmd/rastergen -verify
