TAURI=npm run tauri

.PHONY: build
build:
	$(TAURI) build

.PHONY: dev
dev:
	WEBKIT_DISABLE_DMABUF_RENDERER=1 $(TAURI) dev
