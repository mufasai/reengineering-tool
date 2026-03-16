# ==========================
# CONFIG
# ==========================
IMAGE_TEST=reenginering-tool-fe


# =========================
# REMOTE UPDATE PRODUCTION
# simulasi build yg dilakukan di jenkins
# =========================
build-test-image:
	@echo "Building production image..."
	git checkout main
	@if docker buildx build -f Dockerfile -t $(IMAGE_TEST) .; then \
		echo "✓ Build completed successfully!"; \
	else \
		echo "✗ Build FAILED!"; \
		exit 1; \
	fi

clean-test-image:
	@echo "Removing test image $(IMAGE_TEST)..."
	docker rmi $(IMAGE_TEST) || true
	@echo "Image removed!"

build-test: build-test-image clean-test-image


# ==========================
# CATCH-ALL (IMPORTANT)
# ==========================
%:
	@:
