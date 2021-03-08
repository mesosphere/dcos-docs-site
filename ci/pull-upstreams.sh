#!/bin/bash
set -ex
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../" && pwd)"

bash "$PROJECT_ROOT/ci/pull-upstream.sh" mesosphere/konvoy docs/site release-1.7 pages/dkp/konvoy/1.7
