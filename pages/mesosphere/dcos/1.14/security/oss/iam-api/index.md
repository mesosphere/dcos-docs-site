---
layout: layout.pug
navigationTitle:  Identity and Access Management API
title: Identity and Access Management API
menuWeight: 40
excerpt: Using the DC/OS Identity and Access Management API
render: mustache
model: /mesosphere/dcos/1.14/data.yml
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

The Identity and Access Management API allows you to manage users through a RESTful interface.

# Request and response format

The API supports `JSON` only. You must include `application/json` as your `Content-Type` in the HTTP header, as shown below.

    Content-Type: application/json

# Host name and base path

The host name to use will vary depending on where your program is running.

* If your program runs outside of the DC/OS cluster, you should use the cluster URL. This can be obtained by launching the DC/OS web interface and copying the domain name from the browser. Alternatively, you can log in to the DC/OS CLI and type `dcos config show core.dcos_url` to get the cluster URL. In a production environment, this should be the path to the load balancer which sits in front of your masters.

* If your program runs inside of the cluster, use `master.mesos`.

Append `/acs/api/v1` to the host name, as shown below.

    http://<host-ip>/acs/api/v1

# Authentication

All IAM endpoints require an authentication token--except the `auth` endpoints. The `auth` endpoints do not require authentication tokens because their purpose is to return authentication tokens upon successful login.

# User management

DC/OS Open Source supports three types of users that can be managed via the `/users` API endpoint.

The [User account management](/mesosphere/dcos/1.14/security/oss/user-account-management/) documentation covers invocation of available operations in detail.

# Authentication token verification

The IAM can provide third-party entities with public key information via the `/auth/jwks` API endpoint for verifying DC/OS Authentication tokens out-of-band.

See [Out-of-band token verification](/mesosphere/dcos/1.14/security/oss/authentication/out-of-band-verification/) on how to implement authentication token verification on behalf of the IAM.

# API reference

[swagger api='/mesosphere/dcos/1.14/api/oss-iam.yaml']

# Logging

While the API returns informative error messages, you may also find it useful to check the logs of the service. Refer to [Service and Task Logging](/mesosphere/dcos/1.14/monitoring/logging/) for instructions.

