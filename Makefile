############################# For Development ##########################
.PHONY: build-dev
build-dev: ## Build the development docker image.
	docker-compose -f _docker/docker-compose.dev.yml build

.PHONY: start-dev
start-dev: ## Start the development docker container.
	docker-compose -f _docker/docker-compose.dev.yml up -d

.PHONY: stop-dev
stop-dev: ## Stop the development docker container.
	docker-compose -f _docker/docker-compose.dev.yml down

################################ End ####################################
	
############################# For Production ##########################
.PHONY: build-prod
build-prod: ## Build the production docker image.
	docker-compose -f _docker/docker-compose.prod.yml build

.PHONY: start-prod
start-prod: ## Start the production docker container.
	docker-compose -f _docker/docker-compose.prod.yml up -d

.PHONY: stop-prod
stop-prod: ## Stop the production docker container.
	docker-compose -f _docker/docker-compose.prod.yml down

################################ End #####################################

############################ For Local ###################################
.PHONY: build
build: ## Build the local docker image.
	docker-compose -f _docker/docker-compose.local.yml build

.PHONY: start
start: ## Start the local docker container.
	docker-compose -f _docker/docker-compose.local.yml up -d

.PHONY: stop
stop: ## Stop the local docker container.
	docker-compose -f _docker/docker-compose.local.yml down

################################ End ####################################

