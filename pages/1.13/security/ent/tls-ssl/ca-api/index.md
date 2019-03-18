---
layout: layout.pug
navigationTitle:  Using the Certificate Authority API
title: Using the Certificate Authority API
menuWeight: 500
excerpt: Viewing, creating and signing certificates 
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


# About the Certificate Authority API

The DC/OS Certificate Authority API allows you to view the TLS certificates used by DC/OS Enterprise, create Certificate Signing Requests (CSRs), and have the DC/OS CA sign CSRs.

## Request and response format

The API supports JSON only. You must include `application/json` as your `Content-Type` in the HTTP header, as shown below.

    Content-Type: application/json


## Host name and base path

The host name will vary depending on where your app is running.

* If your app will run outside of the DC/OS cluster, you should use the cluster URL. This can be obtained by launching the DC/OS web interface and copying the domain name from the browser. Alternatively, you can log into the DC/OS CLI and type `dcos config show core.dcos_url` to get the cluster URL. In a production environment, this should be the address of the load balancer which sits in front of your masters.

* If your app will run inside of the cluster, use `master.mesos`.

Append `/ca/api/v2/` to the host name, as shown below.

    https://<host-name-or-ip>/ca/api/v2/


# Authentication and authorization

If the endpoint you wish to access requires authentication, you will need an authentication token with one of the following permissions:

- `dcos:superuser`
- `dcos:adminrouter:ops:ca:ro`
- `dcos:adminrouter:ops:ca:rw`

## Obtaining an authentication token

### Via the IAM API

To get an authentication token, pass the user name and password of a user with the necessary permissions in the body of a request to the `/auth/login` endpoint of the [Identity and Access Management Service API](/1.13/security/ent/iam-api/). It returns an authentication token as shown below.

```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg"
}
```

### Via the DC/OS CLI

When you log into the [DC/OS CLI](/1.13/cli/) using `dcos auth login`, it stores the authentication token value locally. You can reference this value as a variable in cURL commands (discussed in the next section).

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

Authentication tokens expire after five days by default. If your program needs to run longer than five days, you will need a service account. Please see [Provisioning custom services](/1.13/security/ent/service-auth/custom-service-auth/) for more information.

# API reference

[swagger api='/1.12/api/certificate-authority.yaml']


# Logging

While the API returns informative error messages, you may also find it useful to check the logs of the service. Refer to [Service and Task Logging](/1.13/monitoring/logging/) for instructions.
