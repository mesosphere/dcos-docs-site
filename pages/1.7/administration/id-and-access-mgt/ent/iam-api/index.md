---
layout: layout.pug
navigationTitle:  Identity and Access Management API
title: Identity and Access Management API
menuWeight: 3
excerpt:
enterprise: true

---





# About the Identity and Access Management API

The Identity and Access Management API allows you to manage users, user groups, permissions, and LDAP configuration settings through a RESTful interface. It offers all the same functionality as the DC/OS web interface. The API token expires after five days. If your program needs to run longer than five days, you must refresh the token.

## Request and response format

The API supports JSON only. You must include `application/json` as your `Content-Type` in the HTTP header, as shown below.

    Content-Type: application/json
    

## Host name and base path

The IP address of the host is available from the DC/OS web interface in the top left corner. If you hover your mouse over the address, a button appears that allows you to copy the address to your clipboard.

Append `/acs/api/v1` to the host name, as shown below.

    http://<host-ip>/acs/api/v1 
    

## Authentication

Requests to the `/auth/login` resource require a DC/OS user name and password in the body and return an API token. All other requests must include this API token in the `Authorization` field of the HTTP header, as shown below.

    Authorization: token=<your-API-token> 
    

## API reference

[swagger api='/1.7/api/iam.yaml']
