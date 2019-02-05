---
layout: layout.pug
navigationTitle:  Identity and Access Management API
title: Identity and Access Management API
menuWeight: 110
excerpt: Managing users and permissions with the IAM API

enterprise: true
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

The Identity and Access Management API allows you to manage users, user groups, permissions, and LDAP configuration settings through a RESTful interface. It offers more functionality than the DC/OS web interface.


# Request and response format

The API supports JSON only. You must include `application/json` as your `Content-Type` in the HTTP header, as shown below.

    Content-Type: application/json


# Host name and base path

The host name to use will vary depending on where your app is running.

* If your app runs outside of the DC/OS cluster, you should use the cluster URL. This can be obtained by launching the DC/OS web interface and copying the domain name from the browser. Alternatively, you can log in to the DC/OS CLI and type `dcos config show core.dcos_url` to get the cluster URL. In a production environment, this should be the path to the load balancer which sits in front of your masters.

* If your app runs inside of the cluster, use `master.mesos`.

Append `/acs/api/v1` to the host name, as shown below.

    https://<host-ip>/acs/api/v1


# Authentication and authorization

All IAM endpoints require an authentication token and the `dcos:superuser` permission---except the `auth` endpoints. The `auth` endpoints do not require authentication tokens because their purpose is to return authentication tokens upon successful login.

## Obtaining an authentication token

### Via the IAM API

To get an authentication token, pass a user name and password in the body of a request to `/auth/login`. It returns an authentication token as shown below.

```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg"
}
```

### Via the DC/OS CLI

When you log in to the [DC/OS CLI](/1.13/cli/) using `dcos auth login`, it stores the authentication token value locally. You can reference this value as a variable in `curl` commands (discussed in the next section).

Alternatively, you can use the following command to get the authentication token value.

```bash
dcos config show core.dcos_acs_token
```

## Passing an authentication token

### Via the HTTP header

Copy the token value and pass it in the `Authorization` field of the HTTP header, as shown below.

```http
Authorization: token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg
```

### Via `curl` as a string value

Using `curl`, for example, you would pass this value as follows.

```bash
curl -H "Authorization: token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg"
```

### Via `curl` as a DC/OS CLI variable

You can then reference this value in your `curl` commands, as shown below.

```bash
curl -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
```

## Refreshing the authentication token

Authentication tokens expire after five days, by default. If your program needs to run longer than five days, you will need a service account. See [provisioning custom services](/1.13/security/ent/service-auth/custom-service-auth/) for more information.


# API reference

[swagger api='/1.12/api/iam.yaml']


# Logging

While the API returns informative error messages, you may also find it useful to check the logs of the service. Refer to [Service and Task Logging](/1.13/monitoring/logging/) for instructions.
