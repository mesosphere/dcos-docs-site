#!/bin/bash
set -ex
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../" && pwd)"

bash "$PROJECT_ROOT/ci/docs-to-upstream.sh" mesosphere/konvoy docs/site release-1.7 pages/dkp/konvoy/1.7
bash "$PROJECT_ROOT/ci/docs-to-upstream.sh" mesosphere/konvoy docs/site release-1.6 pages/dkp/konvoy/1.6
bash "$PROJECT_ROOT/ci/docs-to-upstream.sh" mesosphere/konvoy docs/site release-1.5 pages/dkp/konvoy/1.5
bash "$PROJECT_ROOT/ci/docs-to-upstream.sh" mesosphere/konvoy docs/site release-1.4 pages/dkp/konvoy/1.4

