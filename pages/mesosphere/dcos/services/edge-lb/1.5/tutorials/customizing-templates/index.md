---
layout: layout.pug
navigationTitle: Customizing Edge-LB templates
title: Customizing Edge-LB templates
menuWeight: 11
excerpt: How to customize Edge-LB load balancing by modifying templates.
enterprise: true
---

Edge-LB uses templates to configure load balancing settings. This tutorial demonstrates how you can create a custom `haproxy` template for Edge-LB to support Basic authentication.

In this tutorial, you use settings in the custom `haproxy` template to create at a simple `userlist` that defines the authenticated and authorized users who are allowed access using `frontend` and `backend` configuration settings.

# Before you begin
You must have:
* An active and properly-configured DC/OS Enterprise cluster.
* Edge-LB installed as described in the Edge-LB [installation instructions](/mesosphere/dcos/services/edge-lb/1.5/getting-started/installing).
* The `edgelb` command-line interface (CLI) installed.

# Create a custom template

To create a custom template for basic authentication:

1. Install Edge-LB as described [Installing Edge-LB](/mesosphere/dcos/services/edge-lb/1.5/getting-started/installing).

1. Create an Edge-LB pool as described in [Expose and load balance a service](/mesosphere/dcos/services/edge-lb/1.5/getting-started/single-lb).

1. [Fetch the template](/mesosphere/dcos/services/edge-lb/1.5/getting-started/auto-pools/#cli-example-usage) for the Edge-LB pool you created in the previous step and save it to a file named `haproxy.tmpl`:

    ```bash
    dcos edgelb template show <pool-name> > haproxy.tmpl
    ```

    For example, if you created the `ping-lb` pool, use the command:

    ```bash
    dcos edgelb template show ping-lb > haproxy.tmpl
    ```

1. Open the `haproxy.tmpl` template you created in the previous step in a text editor.

1. Modify the `haproxy.tmpl` file to create a `basic-auth` user list with user names and passwords for a set of regular and administrative users:

    ```bash
    userlist basic-auth
      group regular-users
      group admin-users

      user admin  password ASYRtiLFCipT6 groups admin-users
      user drew password n5se4LwUfAW1sqA groups regular-users
      user luz password x18R29iAdV/$1QU groups regular-users
      user guest insecure-password guestpassword
    ```

1. Create an access control list (ACL) rule inside the `backend` section for the users and groups you defined in the `userlist` who are allowed to access the load balanced service:

    ```bash
    acl example-auth http_auth(basic-auth)
    http-request auth realm example unless example-auth
    ```

1. Create an access control list (ACL) rule inside the `backend` section to grant different access rights to users who belong to the `admin-users` group  that you defined in the `userlist`:

    ```bash
    acl itadmin-auth http_auth_group(basic-auth) admin-users
    http-request auth realm itadmin unless itadmin-auth
    ```

1. Create additional access control list (ACL) rules inside the `frontend` section to grant limited access to the users who do not belong to the `admin-users` or `regular-users` groups that you defined in the `userlist`:

    ```bash
    acl guest-users hdr_dom(host) -i guest.example.org
    acl basic-auth-user http_auth(basic-auth)
    acl basic-auth-user-with-group  http_auth_group(basic-auth) admin-users regular-users
    http-request auth realm guest if guest-users !basic-auth-user OR guest-users basic-auth-user-with-group
    use_backend web-guest-production if guest-users
    ```

1. Verify your user list and the access control rules you have set for the `frontend` and `backend` sections:

    ```bash
    userlist basic-auth
      group regular-users
      group admin-users

      user admin  password ASYRtiLFCipT6 groups admin-users
      user drew password n5se4LwUfAW1sqA groups regular-users
      user luz password x18R29iAdV/$1QU groups regular-users
      user guest insecure-password guestpassword

    frontend web
      bind :80
      #bind :443 ssl crt /etc/ssl/cert/

      option httplog
      log /dev/log local0 debug

      option forwardfor except 127.0.0.1
      option forwardfor header X-Real-IP

      #redirect scheme https code 301 if !{ ssl_fc }

      # ACL rule for general access for users defined in backend
      acl example hdr_dom(host) -i example.org
      use_backend web-example-production if example

      # ACL rule for admin-users group member defined in the backend
      acl itadmin hdr_dom(host) -i itadmin.example.org
      use_backend web-example-production if itadmin

      # ACL rules for guests who are not admin-users or regular-users
      acl guest-users hdr_dom(host) -i guest.example.org
      acl basic-auth-user http_auth(basic-auth)
      acl basic-auth-user-with-group  http_auth_group(basic-auth) admin-users regular-users
      http-request auth realm guest if guest-users !basic-auth-user OR guest-users basic-auth-user-with-group
      use_backend web-guest-production if guest-users

    backend web-example-production
      acl example-auth http_auth(basic-auth)
      http-request auth realm example unless example-auth

      mode http
      server example 10.0.10.15:80

    backend web-itadmin-production
      acl itadmin-auth http_auth_group(basic-auth) admin-users
      http-request auth realm itadmin unless itadmin-auth

      mode http
      server itadmin 10.0.10.16:80

    backend web-guest-production
      mode http
      server guest 10.0.10.17:80
    ```

1. Update the Edge-LB pool to use the custom template:

    ```bash
    dcos edgelb template update <pool-name> haproxy.tmpl
    ```

    For example, if the pool is `ping-lb`, use the command:

    ```bash
    dcos edgelb template update ping-lb haproxy.tmpl
    ```
