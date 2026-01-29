TAURI=npm run tauri

.PHONY: build
build:
	$(TAURI) build

.PHONY: dev
dev:
	WEBKIT_DISABLE_DMABUF_RENDERER=1 $(TAURI) dev

.PHONY: web-build
web-build:
	npm run build

.PHONY: web-dev
web-dev:
	npm run dev
