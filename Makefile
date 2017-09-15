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
	npm run pdf
	./scripts/pdf.sh ./build/docs ./build-pdf http://0.0.0.0:8002/
	#./scripts/pdf.sh ./build/test ./build-pdf http://0.0.0.0:8002/

#
# API
#

swagger:
	./scripts/swagger.sh ./pages ./build-swagger

ngindox:
	./scripts/ngindox.sh ./pages ./build-ngindox

#
# Docker
#

docker-production:
	docker-compose -f ./docker/docker-compose.production.yml build
	docker-compose -f ./docker/docker-compose.production.yml up -d

docker-purge:
	./scripts/docker-purge.sh

docker-build:
	docker-compose build