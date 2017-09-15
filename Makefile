start:
	echo "Start"

#
# Util
#

clean:
	./scripts/clean.sh

#
# Migration
#

migration:
	./scripts/migration.sh

#
# PDF
#

pdf: swagger ngindox
	./scripts/pdf.sh

#
# API
#

swagger:
	./scripts/swagger.sh

ngindox:
	./scripts/ngindox.sh

#
# Docker
#

docker-development:
	docker-compose -f ./docker-compose.yml build
	docker-compose -f ./docker-compose.yml up -d

docker-production:
	docker-compose -f ./docker-compose.production.yml build
	docker-compose -f ./docker-compose.production.yml up -d

docker-purge:
	docker stop `docker ps -a -q`
	docker rm -v `docker ps -a -q`
	docker rmi `docker images -a -q`

docker-build:
	docker-compose build