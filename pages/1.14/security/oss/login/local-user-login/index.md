---
layout: layout.pug
navigationTitle:  Local User Login
title: Local User Login
excerpt: Logging in to DC/OS as a local user
render: mustache
model: /1.14/data.yml
menuWeight: 20
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

# Logging in using the DC/OS CLI

**Prerequisite:**
- [DC/OS CLI](/mesosphere/dcos/1.14/cli/)

Using the [DC/OS CLI](/mesosphere/dcos/1.14/cli/) one can log in as a local DC/OS user by specifying the `dcos-users` login provider.

1. To log in via the DC/OS CLI, replace `uid` and `password` in the following [auth login](/mesosphere/dcos/1.14/cli/command-reference/dcos-auth/dcos-auth-login/) command:

    ```bash
    dcos auth login --provider=dcos-users --username=<uid> --password=<password>
    ```

1. Display the DC/OS authentication token by executing the following command:

    ```bash
    dcos config show core.dcos_acs_token
    ```

1. Export the DC/OS Authentication token into environment for using it in other commands:

    ```bash
    export TOKEN=$(dcos config show core.dcos_acs_token)
    ```

# Logging in using the IAM API

Local users can log in using [Identity and Access Management (IAM) API](/mesosphere/dcos/1.14/security/oss/iam-api/).

1. To log in to local user accounts, replace `<uid>` and `<password>` in the following command:

    ```bash
    curl -X POST http://<host-ip>/acs/api/v1/auth/login -d '{"uid": "<uid>", "password": "<password>"}' -H 'Content-Type: application/json'
    ```

1. A DC/OS Authentication token similar to the one below will be returned in the HTTP response body:

    ```json
    {
      "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg"
    }
    ```
