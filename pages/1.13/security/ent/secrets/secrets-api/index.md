---
layout: layout.pug
navigationTitle:  Secrets API
title: Secrets API
menuWeight: 6
excerpt: Understanding the Secrets API

enterprise: true
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->



# About the Secrets API

The Secrets API allows you to manage secrets and perform some back-end functions, such as sealing and unsealing the Secret Store. It offers more functionality than the DC/OS GUI.

# Request and response format

The API supports JSON only. You must include `application/json` as your `Content-Type` in the HTTP header, as shown below.

    Content-Type: application/json


# Host name and base path

The host name to use varies according to where your app is running.

* If your app will run outside of the DC/OS cluster, you should use the cluster URL. To obtain the cluster URL, launch the DC/OS GUI and copy the domain name from the browser. In a production environment, this should be the path to the load balancer that sits in front of your masters.

* If your app will run inside of the cluster, use `master.mesos`.

Append `/secrets/v1/<api_endpoint>` to the host name, as shown below.

    https://<host-name-or-ip>/secrets/v1/<api_endpoint>


# Authentication and authorization

## About authentication and authorization

All Secrets API endpoints require an authentication token.

## Obtaining an authentication token

### Via the IAM API

To get an authentication token, pass the user name and password of a `superuser` in the body of a request to the `/auth/login` endpoint of the [Identity and Access Management Service API](/1.13/security/ent/iam-api/). It returns an authentication token as shown below.

```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg"
}
```

### Via the DC/OS CLI

When you log into the [DC/OS CLI](/1.13/cli/) using `dcos auth login`, it stores the authentication token value locally. You can reference this value as a variable in `curl` commands (discussed in the next section). Alternatively, you can use the following command to get the authentication token value:

```bash
dcos config show core.dcos_acs_token
```

## Passing an authentication token

You can pass an authentication token by way of the HTTP header, or by using curl as either a string variable or a DC/OS CLI variable.

### Via the HTTP header

Copy the token value and pass it in the `Authorization` field of the HTTP header, as shown below.

```http
Authorization: token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg
```

### Via curl as a string value

Using `curl`, for example, you would pass this value as follows.

```bash
curl -H "Authorization: token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg"
```

### Via curl as a DC/OS CLI variable

You can then reference this value in your `curl` commands, as shown below.

```bash
curl -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
```

## Refreshing the authentication token

Authentication tokens expire after five days by default. If your program needs to run longer than five days, you will need a service account. Please see [Provisioning custom services](/1.13/security/ent/service-auth/custom-service-auth/) for more information.


# API reference

[swagger api='/1.12/api/secrets.yaml']


# Logging

While the API returns informative error messages, you may also find it useful to check the logs of the service. Refer to [Service and Task Logging](/1.13/monitoring/logging/) for instructions
