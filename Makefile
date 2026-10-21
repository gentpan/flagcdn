.PHONY: dev api web preview install build rastergen raster-verify

ROOT := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

# 本地开发：Go API :8080 + React (Vite) :3000
dev:
	@echo "Starting Go API :8080 + React dev :3000"
	@$(MAKE) -j2 api web

api:
	@cd $(ROOT) && go run ./cmd/api -root .

web:
	@cd $(ROOT)apps/react && npm run dev

# 生产预览：vite build + vite preview :3000
preview:
	@cd $(ROOT)apps/react && npm run build && npm run preview -- --port 3000

install:
	@cd $(ROOT)apps/react && npm install

build:
	@cd $(ROOT)apps/react && npm run build
	@cd $(ROOT) && go build -o bin/flagcdn-api ./cmd/api

rastergen:
	@cd $(ROOT) && go run ./cmd/rastergen -workers 12

raster-verify:
	@cd $(ROOT) && go run ./cmd/rastergen -verify
