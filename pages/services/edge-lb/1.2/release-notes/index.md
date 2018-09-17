---
layout: layout.pug
navigationTitle:  Edge-LB Release Notes
title: Edge-LB Release Notes
menuWeight: 0
excerpt: Release notes for Edge-LB 1.2.1

enterprise: false
---

These are the release notes for Edge-LB 1.2.1.

# v1.2.1

Released on September 17, 2018.

## Notable Changes:


Universe Repo Artifacts:

- https://downloads.mesosphere.com/edgelb/v1.2.1/assets/stub-universe-edgelb.json
- https://downloads.mesosphere.com/edgelb-pool/v1.2.1/assets/stub-universe-edgelb-pool.json

## Known Limitations

* Edge-LB does not currently support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.
* Edge-LB does not currently support self-service configuration; all configuration must be handled centrally.

## Known Issues

* The steps presented in the UI to uninstall Edge-LB are incorrect. Follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.2/uninstalling/).
* Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with ext4 may have connection issues.
* If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion.  It must be removed manually.

# v1.2.0

Released on September 11, 2018.

## Notable Changes:

* dcos-template: properly handle nil values for some of the Mesos Task's protobuf fields.
* dcos-template: set maximum grpc recv. message size to 100MiB.
* lbmgr: adjust environment passing to match the new haproxy svc launch model. This fixes AUTOCERT and SECRET env passing in the haproxy task container.
* api-swagger-spec: bump api version to match edgelb version. This change is required only for documentation accuracy purposes.
* introduce proper versioning for edgelb-pool comos package. Now the version of the package matches the version of the edgelb package itself instead of just "stub-universe"
* make the output of `dcos edgelb show --json` cmd. be the actual pool configuration instead of wrapping it in a config container. This enables e.g. feeding the output of `show` command directly to the `update` command
* cleanup of the goswagger code generation code and build chain, bump of goswagger tool used for generation from v0.11 to v0.16
* bump golang used to 1.10.3 from 1.8.3
* fix anonymous ACLs logic for predefined conditions
* bump haproxy to 1.8.13 from 1.8.12, changelog: http://git.haproxy.org/?p=haproxy-1.8.git;a=blob;f=CHANGELOG;h=aed48fc5fb951aff7dd458c4bc9bfcfe1d5dd99a;hb=HEAD
* commit of the protobuf code changes that stem from github.com/golang/protobuf/protoc-gen-go tool update

Universe Repo Artifacts:

- https://downloads.mesosphere.com/edgelb/v1.2.0/assets/stub-universe-edgelb.json
- https://downloads.mesosphere.com/edgelb-pool/v1.2.0/assets/stub-universe-edgelb-pool.json

Shortlist:

```

      dcos-template: set maximum recv message size to 100MiB
      dcos-template/dependency: better comments
      dcos-template/dependency: use huge name instead of key
      Bump haproxy to 1.8.13 from 1.8.12
      Fix anonymous ACLs logic for predefined conditions
      Fix linting bugs
      models: Fix string formatting
      Standardize on github.com/BurntSushi/toml in order to avoid import collisions with lowercase version
      apiserver: include all of the swagger-generated code in the repo
      spec: bump go-swagger, rename the binary so that it is version-agnostic
      apiserver:spec:models: API code regeneration using new go-swagger (0.16.0)
      framework:apiserver: Adjust non-generated code to accomodate go-swagger update
      Bump vendored dependencies to match the changes done by code re-generation using go-swagger 0.16
      apiserver: remove reduntant go:generate comment
      spec: Add missing newlines to swagger spec files
      spec: remove newline at the end of swagger.json
      framework: update go:generate stanza, move it into a separate file
      Remove redundant swagger.json file
      Migrate away swagger definitions from YML to Json
      spec: refactor Makefile
      spec: make packageVersoins use the $DOCKER_VERSION variable
      framework/edgelb/cli: make `show --json` output the pool config instead of the container.
      Bump API version in the swagger spec
      lbmgr: Adjust environment passing to match the new haproxy svc launching model
      itests: Add integration tests for autocert feature
      dcos-template: properly handle nil values for some of the Mesos Tasks's protobuf fields
      dcos-template: fix remaining direct accesses to protobufs fields
      mesos-listener: commit protobuf code changes that stem from github.com/golang/protobuf/protoc-gen-go update
```

## Known Limitations

* Edge-LB does not currently support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.
* Edge-LB does not currently support self-service configuration; all configuration must be handled centrally.

## Known Issues

* The steps presented in the UI to uninstall Edge-LB are incorrect. Follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.2/uninstalling/).
* Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with ext4 may have connection issues.
* If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion.  It must be removed manually.
