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

## Notable Changes


Universe Repo Artifacts:

- https://downloads.mesosphere.com/edgelb/v1.2.1/assets/stub-universe-edgelb.json
- https://downloads.mesosphere.com/edgelb-pool/v1.2.1/assets/stub-universe-edgelb-pool.json

## Known Limitations

* Edge-LB does not currently support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.
* Edge-LB does not currently support self-service configuration; all configuration must be handled centrally.

## Known Issues

* The steps presented in the UI to uninstall Edge-LB are incorrect. Follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.2/uninstalling/).
* Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with ext4 may have connection issues.
* If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion. It must be removed manually.

# v1.2.0

Released on September 11, 2018.

## Notable Changes

* dcos-template: Properly handle nil values for some of the Mesos tasks protobuf fields.
* dcos-template: Set maximum grpc recv. message size to 100MIB.
* lbmgr: Adjust environment passing to match the new haproxy svc launch model. This fixes `AUTOCERT` and `SECRET` env passing in the haproxy task container.
* api-swagger-spec: Bump api version to match edgelb version. 
* Introduce proper versioning for edgelb-pool cosmos package to match the version of the package with the version of the edgelb package itself instead of `stub-universe`.
* Make the output of `dcos edgelb show --json` cmd be the actual pool configuration instead of wrapping it in a configuration container. This enables feeding the output of `show` command directly to the `update` command.
* Cleanup of the goswagger code generation code and build chain, bump of goswagger tool used for generation from v0.11 to v0.16.
* Bump `golang` from 1.8.3 to 1.10.3.
* Fix anonymous ACLs logic for predefined conditions.
* Bump `haproxy` from 1.8.12 to 1.8.13. [changelog] (http://git.haproxy.org/?p=haproxy-1.8.git;a=blob;f=CHANGELOG;h=aed48fc5fb951aff7dd458c4bc9bfcfe1d5dd99a;hb=HEAD)
* Commit protobuf code changes that stem from [tool update](https://github.com/golang/protobuf/tree/master/protoc-gen-go).

### Universe Repo Artifacts

- [EdgeLB on DC/OS](https://downloads.mesosphere.com/edgelb/v1.2.0/assets/stub-universe-edgelb.json).
- [EdgeLB pool on DC/OS](https://downloads.mesosphere.com/edgelb-pool/v1.2.0/assets/stub-universe-edgelb-pool.json).

#### Shortlist:

```

      dcos-template: set maximum recv message size to 100MiB
      dcos-template/dependency: better comments
      dcos-template/dependency: use huge name instead of key
      Bump haproxy to 1.8.13 from 1.8.12
      Fix anonymous ACLs logic for predefined conditions
      Fix linting bugs
      models: Fix string formatting
      Standardize on github.com/BurntSushi/toml in order to avoid import collisions with lowercase version
      apiserver: Include all of the swagger-generated code in the repo
      spec: Bump go-swagger, rename the binary so that it is version-agnostic
      apiserver:spec:models: API code regeneration using new go-swagger (0.16.0)
      framework:apiserver: Adjust non-generated code to accomodate go-swagger update
      Bump vendored dependencies to match the changes done by code re-generation using go-swagger 0.16
      apiserver: Remove reduntant go:generate comment
      spec: Add missing newlines to swagger spec files
      spec: Remove newline at the end of swagger.json
      framework: Update go:generate stanza, move it into a separate file
      Remove redundant swagger.json file
      Migrate away swagger definitions from YML to Json
      spec: Refactor Makefile
      spec: Make packageVersoins use the $DOCKER_VERSION variable
      framework/edgelb/cli: Make `show --json` output the pool config instead of the container.
      Bump API version in the swagger spec
      lbmgr: Adjust environment passing to match the new haproxy svc launching model
      itests: Add integration tests for autocert feature
      dcos-template: Properly handle nil values for some of the Mesos Tasks's protobuf fields
      dcos-template: Fix remaining direct accesses to protobufs fields
      mesos-listener: Commit protobuf code changes that stem from [tool update](https://github.com/golang/protobuf/tree/master/protoc-gen-go)
```

## Known Limitations

* Edge-LB does not currently support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.
* Edge-LB does not currently support self-service configuration; all configuration must be handled centrally.

## Known Issues

* The steps presented in the UI to uninstall Edge-LB are incorrect. Follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.2/uninstalling/).
* Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with ext4 may have connection issues.
* If a pool is configured with invalid constraints, that pool will not be created or deleted correctly. It must be removed manually.
